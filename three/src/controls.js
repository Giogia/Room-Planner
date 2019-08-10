'use strict';

import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { DragControls } from 'three-controls';
import { MapControls } from 'three-controls';

import {camera, renderer} from "./app";

export var dragControls, mapControls, orbitControls;

export function  enableOrbitControls(){

    orbitControls = new OrbitControls(camera);
    orbitControls.target.set(0, 0, 0);

    // smooth control settings
    orbitControls.enablePan = false;
    orbitControls.enableZoom = false;
    orbitControls.enableDamping = true;
    orbitControls.screenSpacePanning = false;
    orbitControls.minPolarAngle = Math.PI/12;
    orbitControls.maxPolarAngle = Math.PI/2;
    orbitControls.dampingFactor = 0.07;
    orbitControls.rotateSpeed = 0.07;

    //orbitControls.enabled = false;
    orbitControls.update();
}


export function enableMapControls(){

    mapControls = new MapControls(camera, renderer.domElement, {
        target: new THREE.Vector3(0,1,0)
    });

    mapControls.enableRotate = false;
    mapControls.enablePan = true;
    mapControls.screenSpacePanning = false;
    mapControls.panSpeed = 1;
    mapControls.minDistance = 2;
    mapControls.maxDistance = 20;

    mapControls.enabled = false;
    mapControls.update();
}


export function enableDragControls(objects){

    dragControls = new DragControls(objects, camera, renderer.domElement);

    dragControls.addEventListener( 'dragstart', function () {
        orbitControls.enabled = false;
    } );
    dragControls.addEventListener( 'dragend', function () {
        orbitControls.enabled = true;
    } );
    dragControls.addEventListener('drag', (event) => {
        event.object.position.y = 0;
    });
}

