'use strict';

import * as THREE from "three";
import {dragControls, mapControls, orbitControls} from "./controls";
import * as TWEEN from "tween";

import { camera, canvas, currentObjects, wallsModel, floorModel } from "./app";
import { drawPoint } from "./draw";

let floorPlanView = false;

export function toggleView(event) {

    event.preventDefault();
    if (event.code === "Space" && !floorPlanView) {

        tweenCamera(new THREE.Vector3(0, 30, 0.5));
        hide(currentObjects);
        hide(wallsModel.children);
        show(floorModel.children);

        canvas.addEventListener( 'click', drawPoint, false);

    }
    if (event.code === "Space" && floorPlanView) {

        mapControls.reset();

        tweenCamera(new THREE.Vector3(20, 30, 30));
        show(currentObjects);
        show(wallsModel.children);
        hide(floorModel.children);

        canvas.removeEventListener( 'click', drawPoint, false);
    }

    floorPlanView = !floorPlanView;
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
            camera.lookAt(targetPosition);
        } )
        .onComplete( function () {
            camera.position.copy(targetPosition);
            camera.lookAt(targetPosition);

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