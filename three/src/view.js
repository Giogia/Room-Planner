'use strict';

import * as THREE from "three";
import {dragControls, mapControls, orbitControls} from "./controls";
import * as TWEEN from "tween";

import {camera, scene, canvas, currentObjects, wallsModel, floorModel, list, updateModel} from "./app";
import {editDrawing} from "./draw";
import {drawer} from "./app";
import {addObject} from "./loader";
import {editButton, deleteButton} from "./gui";

let floorPlanView = false;

export function toggleView(event) {

    event.preventDefault();

    drawer.open = !drawer.open;

    (floorPlanView) ? modelView(): drawView();

    floorPlanView = !floorPlanView;
}


function drawView(){

    tweenCamera(new THREE.Vector3(0, 20, 0.1));
    hide(currentObjects);
    hide(wallsModel.children);
    show(floorModel.children);

    deleteButton.style.display = "inline-flex";
    editButton.style.display = "inline-flex";

    editButton.addEventListener( 'click', editDrawing, false);
    list.removeEventListener('click', addObject, false);
}


function modelView(){

    // remove click before transition
    editButton.removeEventListener( 'click', editDrawing, false);
    mapControls.reset();
    updateModel();

    tweenCamera(new THREE.Vector3(6, 8, 8));
    show(currentObjects);
    show(wallsModel.children);
    hide(floorModel.children);

    deleteButton.style.display = "none";
    editButton.style.display = "none";

    list.addEventListener('click', addObject, false);
}


export function tweenCamera(targetPosition, duration=2000){

    orbitControls.enabled = false;
    mapControls.enabled = false;
    dragControls.enabled = false;

    let position = new THREE.Vector3().copy(camera.position);

    new TWEEN.Tween(position).to( targetPosition, duration )
        .easing( TWEEN.Easing.Quintic.Out )
        .onUpdate( function () {
            camera.position.copy(position);
        } )
        .onComplete( function () {
            camera.position.copy(targetPosition);

            if (floorPlanView) {
                mapControls.saveState();
                mapControls.enabled = true;
            }
            else {
                orbitControls.enabled = true;
                dragControls.enabled = true;
            }
        } )
        .start();
}


export function hideCloseWalls(){
    for( let mesh of wallsModel.children){

        mesh.visible = camera.position.distanceTo(mesh.position) >= 8;
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