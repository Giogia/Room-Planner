'use strict';

import * as THREE from 'three';
import * as TWEEN from 'tween';

import { enableOrbitControls, enableMapControls, enableDragControls } from "./controls";
import { addLights } from './lights';
import {addObject, createGround} from "./loader";

import { orbitControls, mapControls, dragControls } from "./controls";
import { createModel, createWallsModel } from "./floorplan";

export var scene, camera, renderer, canvas;

let floorPlanView = false;

export var currentObjects = [];

let floorModel, wallsModel;

let floorPlan = {

    points: [
        {x: -5, z: -5, id: 0},
        {x: 0, z: -5, id: 1},
        {x: -5, z: 0, id: 2},
        {x: 0, z: 0, id: 3},
        {x: 5, z: 0, id: 4},
        {x: -5, z: 3, id: 5},
        {x: 0, z: 2, id: 6},
        {x: 1, z: 2, id: 7},
        {x: 5, z: 2, id: 8},
        {x: -5, z: 5, id: 9},
        {x: 1, z: 5, id: 10},
        {x: 5, z: 5, id: 11},
        {x: 0, z: 3, id: 12}
    ],

    lines: [
        {from: 0, to: 1},
        {from: 0, to: 2},
        {from: 1, to: 3},
        {from: 2, to: 3},
        {from: 2, to: 5},
        {from: 3, to: 4},
        {from: 3, to: 6},
        {from: 4, to: 8},
        {from: 5, to: 12},
        {from: 5, to: 9},
        {from: 6, to: 7},
        {from: 6, to: 12},
        {from: 7, to: 8},
        {from: 7, to: 10},
        {from: 8, to: 11},
        {from: 9, to: 10},
        {from: 10, to: 11}
    ]
};


export function init() {

    canvas = document.getElementById( 'app');
    document.body.appendChild(canvas);

    createRenderer();
    createScene();
    createCamera();

    enableOrbitControls();
    enableMapControls();

    camera.position.set(20, 30, 30);

    addLights();
    createGround();

    floorModel = createModel(floorPlan);
    scene.add(floorModel);
    hide(floorModel.children);

    wallsModel = createWallsModel(floorPlan);
    scene.add(wallsModel);

    document.addEventListener('keypress', toggleView);

    window.onresize = function () {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    };

    // Wait to be loaded completely
    document.addEventListener('DOMContentLoaded', (event) => {
        let list = document.getElementById('objects');
        list.addEventListener('click', click, false);
    });


    animate();
}

function createRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    renderer.gammaOutput = true;
    canvas.appendChild(renderer.domElement);
}


function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);
    scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
}


function createCamera(){
    const fov = 40;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
}


function toggleView(event) {

    event.preventDefault();
    if (event.code === "Space" && !floorPlanView) {

        tweenCamera(new THREE.Vector3(0, 30, 0.5));
        hide(currentObjects);
        hide(wallsModel.children);
        show(floorModel.children);

        //document.addEventListener( 'mousedown', mouseDown);

    }
    if (event.code === "Space" && floorPlanView) {

        mapControls.reset();

        tweenCamera(new THREE.Vector3(20, 30, 30));
        show(currentObjects);
        show(wallsModel.children);
        hide(floorModel.children);

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


function hide(objects) {

    for (let mesh of objects) {
        mesh.visible = false;
    }
}

function show(objects) {

    for (let mesh of objects) {
        mesh.visible = true;
    }
}

function click(event){
    event.preventDefault();
    addObject(event.target.alt);
}


export function animate() {

    requestAnimationFrame( animate );

    orbitControls.update();
    mapControls.update();
    enableDragControls(currentObjects);

    renderer.render( scene, camera );

    TWEEN.update();
}

init();



