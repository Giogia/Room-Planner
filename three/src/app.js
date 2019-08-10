'use strict';

import * as THREE from 'three';
import * as TWEEN from 'tween';

import { enableOrbitControls, enableMapControls, enableDragControls } from "./controls";
import { addLights } from './lights';
import { createGround, loadModel, randomCubes, randomObjects } from "./objects";

import { orbitControls, mapControls, dragControls } from "./controls";
import { createModel, createWallsModel } from "./floorplan";

export var scene, camera, renderer;

let floorPlanView = false;

let cubes;

let floorModel, wallsModel;

var floorPlan = {

    points: [
        {x: 0, z: 0, id: 0},
        {x: 0, z: 4, id: 1},
        {x: 5, z: 0, id: 2},
        {x: 5, z: 2, id: 3}
    ],

    lines: [
        {from: 0, to: 1},
        {from: 0, to: 2},
        {from: 2, to: 3},
        {from: 1, to: 3}
    ]
};


function init() {

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

    loadModel('./models/gltf/wall.glb');

    //for debugging
    cubes = randomCubes();

    enableDragControls(cubes);

    document.addEventListener('keypress', toggleView);

    window.onresize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    animate();
}


function mouseDown(event){

    mapControls.enabled = false;

    var x = ( event.clientX / window.innerWidth ) * 2 - 1;
    var y =  - ( event.clientY / window.innerHeight ) * 2 + 1;

    document.addEventListener( 'mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}

function mouseMove(event){

}

function mouseUp(event){
    mapControls.enabled = true;
    document.removeEventListener("mousemove", mouseMove);

}


function createRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;
    document.body.appendChild(renderer.domElement);
}


function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);
    scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
}


function createCamera(){
    const fov = 40;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
}


function toggleView(event) {

    event.preventDefault();
    if (event.code === "Space" && !floorPlanView) {

        tweenCamera(new THREE.Vector3(0, 30, 0.5));
        hide(cubes);
        hide(wallsModel.children);
        show(floorModel.children);

        //document.addEventListener( 'mousedown', mouseDown);

    }
    if (event.code === "Space" && floorPlanView) {

        mapControls.reset();

        tweenCamera(new THREE.Vector3(20, 30, 30));
        show(cubes);
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


function animate() {

    requestAnimationFrame( animate );

    orbitControls.update();
    mapControls.update();

    renderer.render( scene, camera );

    TWEEN.update();
}

init();



