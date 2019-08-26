'use strict';

import * as THREE from "three";
import {dragControls, mapControls, orbitControls} from "./controls";
import * as TWEEN from "tween";

import {camera, app, currentObjects, wallsModel, floorModel, updateModel} from "./app";
import {drawPoint} from "./draw";
import {modelButtons, viewButtons} from "../gui";

let floorPlanView = false;

export function toggleView(event) {

    event.preventDefault();

    (floorPlanView) ? modelView(): drawView();

    floorPlanView = !floorPlanView;
}


function drawView(){

    tweenCamera(new THREE.Vector3(0, 20, 0.1));
    hide(currentObjects);
    hide(wallsModel.children);
    show(floorModel.children);

    viewButtons();

    app.addEventListener( 'click', drawPoint, false);
}


function modelView(){

    // remove click before transition
    app.removeEventListener( 'click', drawPoint, false);
    mapControls.reset();
    updateModel();

    tweenCamera(new THREE.Vector3(8, 12, 12));
    show(currentObjects);
    show(wallsModel.children);
    hide(floorModel.children);

    modelButtons();
}


function tweenCamera(targetPosition){

    orbitControls.enabled = false;
    mapControls.enabled = false;
    dragControls.enabled = false;

    const duration = 2000;

    let position = new THREE.Vector3().copy(camera.position);

    new TWEEN.Tween(position).to( targetPosition, duration )
        .easing( TWEEN.Easing.Cubic.Out )
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