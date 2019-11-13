import * as THREE from "three";
import * as TWEEN from "tween.js";

import {dragControls, mapControls, orbitControls} from "./controls";

import { drawer, camera, list, canvas } from "./app";
import { currentObjects } from "./app";
import { wallsModel, drawModel, roomCenters, skirtingModel, floorModel} from "./app";
import {updateModel, selectObject} from "./app";

import {addObject} from "./loader";

import {editButton, deleteButton} from "./buttons";
import { activateDrawButtons, deactivateButtons, activateButtons, deactivateDrawButtons, showButton, hideButton } from "./buttons";


let floorPlanView = false;


export function toggleView(event) {

    event.preventDefault();

    drawer.open = !drawer.open;
    floorPlanView = !floorPlanView;

    (floorPlanView) ? drawView() : modelView();
}


function drawView(){

    showButton(deleteButton, 0);
    showButton(editButton, 0);

    activateDrawButtons();

    list.removeEventListener('click', addObject, false);
    canvas.removeEventListener('dblclick', selectObject, false);

    hide(currentObjects);
    hide(floorModel.children);
    hide(roomCenters.children);
    hide(wallsModel.children);
    hide(skirtingModel.children);
    show(drawModel.children);

    tweenCamera(new THREE.Vector3(0, 30, 2));
}


function modelView(){

    mapControls.reset();

    hideButton(deleteButton, 300);
    hideButton(editButton, 150);

    deactivateDrawButtons();

    list.addEventListener('click', addObject, false);
    canvas.addEventListener('dblclick', selectObject, false);

    updateModel();

    setTimeout( function(){
        tweenCamera(new THREE.Vector3(6, 8, 8));
    }, 500);

    setTimeout( function(){
        show(currentObjects);
        show(floorModel.children);
        show(roomCenters.children);
        show(wallsModel.children);
        show(skirtingModel.children);
        hide(drawModel.children);
    },500);
}


export function tweenCamera(targetPosition, duration=2000){

    deactivateButtons();

    orbitControls.enabled = false;
    mapControls.enabled = false;
    dragControls.enabled = false;

    let position = new THREE.Vector3().copy(camera.position);

    new TWEEN.Tween(position)

        .to( targetPosition, duration )

        .easing( TWEEN.Easing.Circular.Out )

        .onUpdate( function() {
            camera.position.copy(position);
        })

        .onComplete( function () {

            camera.position.copy(targetPosition);

            if (floorPlanView) {
                mapControls.saveState();
                mapControls.enabled = true;
            }
            if (!floorPlanView) {
                orbitControls.enabled = true;
                dragControls.enabled = true;
            }
        })

        .start();

    activateButtons();
}


export function hideCloseWalls(){
    if(!floorPlanView){
        for( let mesh of wallsModel.children){
            let distance = camera.position.distanceTo(mesh.position);
            mesh.visible = distance >= 1;
            mesh.material.opacity = Math.log(distance-8);
        }
    }
}

export function showRoomCenters(){
    if(!floorPlanView){
        for( let mesh of roomCenters.children){
            let distance = camera.position.distanceTo(mesh.position);
            mesh.visible = distance <= 10;
        }
    }
}


export function hide(objects) {

    for (let mesh of objects) {
        mesh.visible = false;
    }
}

export function show(objects) {

    for (let mesh of objects) {
        mesh.visible = true;
    }
}
