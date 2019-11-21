'use strict';

import * as THREE from 'three';
import OrbitControls from 'three-controls/src/js/OrbitControls';
import MapControls from 'three-controls/src/js/MapControls';
import TransformControls from "three-controls/src/js/TransformControls";
//import { PointerLockControls } from './jsm/controls/PointerLockControls.js';

import {camera, renderer, canvas, animate, scene} from "./app";
import ThreeDragger from 'three-dragger';
import {editMode, viewMode} from "./buttons";
import {currentObjects} from "./objects";
import {saveJson} from "./loader";

export var dragControls, mapControls, transformControls, orbitControls, pointerLockControls;
export var draggableObjects = [];

export function  enableOrbitControls(){

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 0, 0);

    // smooth control settings
    orbitControls.enablePan = false;
    orbitControls.enableZoom = true;
    orbitControls.enableDamping = true;
    orbitControls.screenSpacePanning = false;
    orbitControls.minPolarAngle = 0;
    orbitControls.maxPolarAngle = Math.PI/2-Math.PI/32;
    orbitControls.dampingFactor = 0.05;
    orbitControls.rotateSpeed = 0.1;
    orbitControls.minDistance = 0;
    orbitControls.maxDistance = 100;

    orbitControls.update();
}

/*export function pointerLockControls(){

    pointerLockControls = new PointerLockControls(camera, renderer.domElement);

}


 */
export function enableTransformControls(){

    transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.enabled = true;
    transformControls.visible = true;
    transformControls.showX = true;
    transformControls.showY = true;
    transformControls.showZ = true;

    /*let geometry = new THREE.BoxBufferGeometry(2,2,2);
    let material = new THREE.MeshLambertMaterial({color: 0xffffff});

    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    transformControls.attach(mesh);

     */
    //scene.add(transformControls);
}


export function enableMapControls(){

    mapControls = new MapControls(camera, renderer.domElement, {
        target: new THREE.Plane(new THREE.Vector3(0,1,0),0),
    });

    mapControls.enableRotate = false;
    mapControls.screenSpacePanning = false;
    mapControls.enableDamping = false;

    mapControls.enableZoom = true;
    mapControls.minDistance = 0;
    mapControls.maxDistance = 100;

    mapControls.enabled = false;
    mapControls.update();

    mapControls.addEventListener('change', function(){
        setTimeout( function(){
            viewMode();
        }, 100);
    });

    mapControls.addEventListener('end', function(){
        setTimeout( function(){
            editMode();
        }, 100);
    });
}


export function enableDragControls(){

    let dragZone = document.getElementById( 'controls');
    let position = new THREE.Vector3();

    dragControls = new ThreeDragger(draggableObjects, camera, dragZone);

    dragControls.on( 'dragstart', function () {
        orbitControls.enabled = false;
    } );

    dragControls.on('drag', function (event) {

        let vector = new THREE.Vector3();

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

        while(group.type !== 'Scene'){
            group = group.parent
        }

        group.position.set(position.x, position.y, position.z);
    });

    dragControls.on( 'dragend', async function () {
        orbitControls.enabled = true;

        for (let object of dragControls.objects){

             console.log(object);

            let dragged = _.find(currentObjects.objects, {name: object.name});
            dragged.x = object.position.x;
            dragged.y = object.position.y;
            dragged.z = object.position.z;
        }

        await saveJson('currentObjects', currentObjects);
    });
}

