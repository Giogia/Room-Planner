import * as THREE from "three";
import * as TWEEN from "tween.js";

import {dragControls, draggableObjects, mapControls, orbitControls} from "./controls";

import {drawer, camera, list, canvas, scene} from "./app";
import {addObject, selectDraggableObject} from "./objects";
import {wallsModel, drawModel, roomCenters, skirtingModel, floorModel, updateModel} from "./walls";

import {
    modelButtons,
    drawButtons,
    showDrawButtons,
    deactivateModelButtons,
    hideModelButtons,
    hideDrawButtons, activateModelButtons, showModelButtons, firstIcon, secondIcon, showDrawIcon, showModelIcon
} from "./buttons";
import {activateDrawButtons, deactivateButtons, activateButtons, deactivateDrawButtons} from "./buttons";
import {directional} from "./lights";


let floorPlanView = false;


export function toggleView(event) {

    event.preventDefault();

    drawer.open = !drawer.open;
    floorPlanView = !floorPlanView;

    (floorPlanView) ? drawView() : modelView();
}


function drawView(){

    deactivateModelButtons();
    hideModelButtons();
    setTimeout( () => {
        activateDrawButtons();
        showDrawButtons();
        showDrawIcon();
    }, 500);

    list.removeEventListener('click', addObject, false);
    canvas.removeEventListener('dblclick', selectDraggableObject, false);

    scene.remove( directional );

    hide(draggableObjects);
    hide(floorModel.children);
    hide(roomCenters.children);
    hide(wallsModel.children);
    hide(skirtingModel.children);
    show(drawModel.children);

    tweenCamera(new THREE.Vector3(-0.01, 30, 0));
}


function modelView(){

    mapControls.reset();

    deactivateDrawButtons();
    hideDrawButtons();
    setTimeout( () => {
        activateModelButtons();
        showModelButtons();
        showModelIcon();
    }, 500);


    deactivateDrawButtons();

    list.addEventListener('click', addObject, false);
    canvas.addEventListener('dblclick', selectDraggableObject, false);

    updateModel();

    scene.add( directional );

    tweenCamera(new THREE.Vector3(-7, 9, -16));

    show(draggableObjects);
    show(floorModel.children);
    show(roomCenters.children);
    show(wallsModel.children);
    show(skirtingModel.children);
    hide(drawModel.children);
}


export function tweenCamera(targetPosition, duration=2000){

    deactivateButtons();

    orbitControls.enabled = false;
    mapControls.enabled = false;
    dragControls.enabled = false;

    let position = new THREE.Vector3().copy(camera.position);

    new TWEEN.Tween(position)

        .to( targetPosition, duration )

        .easing( TWEEN.Easing.Quartic.InOut )

        .onUpdate( () => {
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
