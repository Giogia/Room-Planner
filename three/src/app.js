'use strict';

import * as THREE from 'three';
import * as TWEEN from 'tween';

import {enableOrbitControls, enableMapControls, enableDragControls, dragControls} from "./controls";
import { addLights } from './lights';
import { addObject } from "./loader";
import { orbitControls, mapControls } from "./controls";
import { createModel, createWallsModel } from "./floorplan";
import { hide } from "./view";
import { floorPlan } from "./draw";
import {createButtons} from "../gui";

export var scene, camera, renderer, canvas, app;
export var currentObjects = [];
export let floorModel, wallsModel;

export function init() {

    canvas = document.getElementById( 'canvas');
    document.body.appendChild(canvas);

    app = document.getElementById('app');
    canvas.appendChild(app);

    createRenderer();
    createScene();
    createCamera();

    enableOrbitControls();
    enableMapControls();
    //enableDragControls();

    camera.position.set(8, 12, 12);

    addLights();
    createGround();

    floorModel = createModel(floorPlan);
    scene.add(floorModel);
    hide(floorModel.children);

    wallsModel = createWallsModel(floorPlan);
    scene.add(wallsModel);

    window.onresize = function () {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    };

    // Wait to be loaded completely
    document.addEventListener('DOMContentLoaded', (event) => {

        document.getElementById('objects').addEventListener('click', addObject, false);
        //document.getElementById( 'app').addEventListener('click', selectObject, false);
        createButtons()
    });

    animate();
}

function createRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    renderer.gammaOutput = true;
    app.appendChild(renderer.domElement);
}


function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa9cce3);
    //scene.fog = new THREE.Fog(0xffffff, 10, 2000);
    scene.fog = new THREE.FogExp2(0xa9cce3, 0.02);
}


function createCamera(){
    const fov = 40;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
}


function createGround() {

    let ground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0xabb5ba, depthWrite: false}));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    let grid = new THREE.GridHelper(100, 50, 0x000000, 0x000000);
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    grid.receiveShadow = true;
    scene.add(grid);

    //let axesHelper = new THREE.AxesHelper( 5 );
    //scene.add( axesHelper );
}


function selectObject(event){

    event.preventDefault();
    dragControls.showX = ! dragControls.showX;
    dragControls.showZ = ! dragControls.showZ;
}

export function updateScene(){

    scene.remove(floorModel);
    floorModel = createModel(floorPlan);
    scene.add(floorModel);
}

export function updateModel(){
    scene.remove(wallsModel);
    wallsModel = createWallsModel(floorPlan);
    scene.add(wallsModel);
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



