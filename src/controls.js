'use strict';

import * as THREE from 'three';
import OrbitControls from 'three-controls/src/js/OrbitControls';
import MapControls from 'three-controls/src/js/MapControls';
import TransformControls from "three-controls/src/js/TransformControls";
import {camera, canvas, renderer} from "./app";
import ThreeDragger from 'three-dragger';
import {currentMode, deleteMode, editMode, viewMode} from "./buttons";
import {currentObjects, selectDraggableObject, selectObject} from "./objects";
import {saveJson} from "./loader";
//import { PointerLockControls } from './jsm/controls/PointerLockControls.js';

export var dragControls, mapControls, transformControls, orbitControls, pointerLockControls;
export var draggableObjects = [];

export function  enableOrbitControls(){

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 0, 0);

    // smooth control settings
    orbitControls.enablePan = false;
    orbitControls.enableZoom = true;
    orbitControls.zoomSpeed = 0.5;
    orbitControls.enableDamping = true;
    orbitControls.screenSpacePanning = false;
    orbitControls.minPolarAngle = 0;
    orbitControls.maxPolarAngle = Math.PI/2-Math.PI/32;
    orbitControls.dampingFactor = 0.05;
    orbitControls.rotateSpeed = 0.09;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 100;

    orbitControls.update();

    /*orbitControls.addEventListener('change', () => {
        console.log('change');
        setTimeout(() => { canvas.removeEventListener('click', selectObject)}, 10);
    });
    orbitControls.addEventListener('end', () => {
        console.log('end');
        setTimeout(() => { canvas.removeEventListener('click', selectObject)}, 10);
    });
     */
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
    mapControls.minDistance = 5;
    mapControls.maxDistance = 100;

    mapControls.enabled = false;
    mapControls.update();

    mapControls.addEventListener('change', () => {
        setTimeout( () => {
            viewMode();
        }, 100);
    });

    mapControls.addEventListener('end', () => {
        setTimeout( () => {

            if(currentMode === "edit"){
                editMode();
            }
            if(currentMode === "delete"){
                deleteMode();
            }
        }, 100);
    });
}


export function enableDragControls(){

    let dragZone = document.getElementById( 'controls');

    let delta = new THREE.Vector3();

    dragControls = new ThreeDragger(draggableObjects, camera, dragZone);

    dragControls.on( 'dragstart', function (event) {
        orbitControls.enabled = false;
        canvas.removeEventListener('dblclick', selectObject);
        canvas.removeEventListener('click', selectDraggableObject);

        let group = getDraggablePosition(event).group;
        let position = getDraggablePosition(event).position;

        delta.set(position.x - group.position.x, position.y - group.position.y, position.z - group.position.z);

    } );

    dragControls.on('drag', function (event) {

        let group = getDraggablePosition(event).group;
        let position = getDraggablePosition(event).position;

        group.position.set(position.x - delta.x, position.y - delta.y, position.z - delta.z);
    });

    dragControls.on( 'dragend', async function (event) {

        orbitControls.enabled = true;
        setTimeout(() => {
            canvas.addEventListener('dblclick', selectObject);
            canvas.addEventListener('click', selectDraggableObject);
        }, 10);

        let object = getDraggablePosition(event).group;

        let dragged = _.find(currentObjects.objects, { mesh: object.uuid });

        dragged.x = object.position.x;
        dragged.y = object.position.y;
        dragged.z = object.position.z;

        await saveJson('currentObjects', currentObjects);
    });
}


function getDraggablePosition(event){

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

    while(group.type !== 'Scene'){
        group = group.parent
    }

    return {group: group, position: position};
}

