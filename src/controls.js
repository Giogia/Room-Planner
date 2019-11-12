'use strict';

import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import {MapControls} from 'three-controls';

import {camera, currentObjects, renderer, canvas} from "./app";
import ThreeDragger from 'three-dragger';
import {floorPlan} from "./draw";

export var dragControls, mapControls, orbitControls;

export function  enableOrbitControls(){

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 0, 0);

    // smooth control settings
    orbitControls.enablePan = false;
    orbitControls.enableZoom = true;
    orbitControls.enableDamping = true;
    orbitControls.screenSpacePanning = false;
    orbitControls.minPolarAngle = 0;
    orbitControls.maxPolarAngle = Math.PI/2-Math.PI/64;
    orbitControls.dampingFactor = 0.09;
    orbitControls.rotateSpeed = 1;
    orbitControls.minDistance = 0;
    orbitControls.maxDistance = 30;

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
    mapControls.minDistance = 10;
    mapControls.maxDistance = 60;

    mapControls.enabled = false;
    mapControls.update();
}


export function enableDragControls(){

    let dragZone = document.getElementById( 'controls');

    dragControls = new ThreeDragger(currentObjects, camera, dragZone);

    dragControls.on( 'dragstart', function () {
        orbitControls.enabled = false;
    } );

    dragControls.on('drag', function (event) {

        let vector = new THREE.Vector3();
        let position = new THREE.Vector3();

        vector.set(
            ( event.event.clientX / canvas.clientWidth ) * 2 - 1,
            - ( event.event.clientY / canvas.clientHeight ) * 2 + 1,
            -1,
        );

        vector.unproject( camera );
        vector.sub( camera.position ).normalize();

        let distance = - camera.position.y / vector.y;

        position.copy( camera.position ).add( vector.multiplyScalar( distance ) );

        let group = event.target;

        while(group.parent.type != 'Scene'){
            group = group.parent
        }

        // reset group position otherwise children are over-translated
        group.parent.position.set(0,0,0);

        for( let child of group.parent.children ){
            child.position.set(position.x, position.y, position.z);
        }

    });

    dragControls.on( 'dragend', function () {
        orbitControls.enabled = true;
    } );
}

