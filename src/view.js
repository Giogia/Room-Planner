'use strict';

import * as THREE from "three";
import {dragControls, mapControls, orbitControls} from "./controls";
import * as TWEEN from "tween.js";

import {camera, currentObjects, wallsModel, floorModel, list, updateModel, canvas} from "./app";
import {drawer, selectObject} from "./app";
import {addObject} from "./loader";
import {
    editButton,
    deleteButton,
    activateDrawButtons,
    deactivateButtons,
    activateButtons,
    deactivateDrawButtons
} from "./buttons";

let floorPlanView = false;


export function toggleView(event) {

    event.preventDefault();

    drawer.open = !drawer.open;

    (floorPlanView) ? modelView(): drawView();

    floorPlanView = !floorPlanView;
}


function drawView(){

    tweenCamera(new THREE.Vector3(0, 30, 1));

    hide(currentObjects);
    hide(wallsModel.children);
    show(floorModel.children);

    showButton(deleteButton, 0);
    showButton(editButton, 0);

    activateDrawButtons();

    list.removeEventListener('click', addObject, false);
    canvas.removeEventListener('dblclick', selectObject, false);
}


function modelView(){

    mapControls.reset();
    updateModel();

    tweenCamera(new THREE.Vector3(6, 8, 8));

    show(currentObjects);
    show(wallsModel.children);
    hide(floorModel.children);

    hideButton(deleteButton, 300);
    hideButton(editButton, 150);

    deactivateDrawButtons();

    list.addEventListener('click', addObject, false);
    canvas.addEventListener('dblclick', selectObject, false);
}


export function tweenCamera(targetPosition, duration=2000){

    deactivateButtons();

    orbitControls.enabled = false;
    mapControls.enabled = false;
    dragControls.enabled = false;

    let position = new THREE.Vector3().copy(camera.position);

    new TWEEN.Tween(position)

        .to( targetPosition, duration )

        .easing( TWEEN.Easing.Quintic.Out )

        .onUpdate( function() {
            camera.position.copy(position);
        })

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
        })

        .start();

    activateButtons();
}


export function hideCloseWalls(){
    if(!floorPlanView){
        for( let mesh of wallsModel.children){
            mesh.visible = camera.position.distanceTo(mesh.position) >= 8;
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

export function hideButton(element, translation=100, timeout=250){
    element.style.transform = 'translateY('+ translation.toString() +'%)';

    setTimeout(function(){
        element.style.opacity = '0';
    }, timeout);
}

export function showButton(element, translation=100){
    element.style.opacity = '100';
    element.style.transform = 'translateY(-'+ translation.toString() +'%)';
}
