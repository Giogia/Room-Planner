'use strict';

import * as THREE from 'three';
import * as TWEEN from 'tween';

import {enableOrbitControls, enableMapControls, enableDragControls, orbitControls, mapControls, dragControls} from "./controls";
import { addLights } from './lights';
import {addObject, loadScene, randomBackgroundObjects} from "./loader";
import { createModel, createWallsModel } from "./walls";
import {hide, hideCloseWalls, tweenCamera} from "./view";
import {floorPlan} from "./draw";
import {createButtons} from "./buttons";
import {MDCDrawer} from "@material/drawer/component";

export var scene, camera, renderer, canvas, raycaster;
export var ground;
export var currentObjects = [];
export let floorModel, wallsModel;
export let list, drawer;


export function init(){

    // Wait to be loaded completely
    document.addEventListener('DOMContentLoaded', (event) => {

        canvas = document.getElementById( 'canvas');
        document.body.appendChild(canvas);

        createRenderer();
        createScene();
        createCamera();
        createDrawer();
        createRayCaster();

        camera.position.set(8, 12, 12);

        enableOrbitControls();
        enableMapControls();
        //enableDragControls();

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

        list = document.getElementById('list');
        list.addEventListener('click', addObject, false);
        canvas.addEventListener('dblclick', selectObject, false);
        createButtons();
        randomBackgroundObjects();

        let loading = document.getElementById('loading');
        loading.style.opacity = '0';
        setTimeout(function(){
            loading.style.display = 'none';
        }, 4000);

        TWEEN.update();
        setTimeout(function(){
            tweenCamera(new THREE.Vector3(6, 8, 8), 3000);
        }, 500);

        loadScene('scene.glb');

        animate();
    });
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
    scene.background = new THREE.Color(0xd7edff);
    scene.fog = new THREE.Fog(0xd7edff, 100, 250);
}


function createCamera(){
    const fov = 35;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 250;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
}


function createGround() {

    ground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        new THREE.MeshLambertMaterial({ color: 0x202020 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    let axesHelper = new THREE.AxesHelper( 50 );
    scene.add( axesHelper );
}

function createDrawer() {
    drawer = new MDCDrawer.attachTo(document.getElementsByClassName("mdc-drawer")[0]);
    drawer.open = true;
}


function createRayCaster(){
    raycaster = new THREE.Raycaster();
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


function selectObject(event){

    let mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / canvas.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / canvas.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    console.log(currentObjects);

    let intersects = raycaster.intersectObjects( currentObjects );

    for (let intersect of intersects) {

        if(intersect.object.type == "Scene"){
             intersect.object.material.color.setHex(0xe8405e);
        }

		console.log(intersect);
	}
}


export function animate() {

    requestAnimationFrame( animate );

    orbitControls.update();
    mapControls.update();
    //dragControls.update(currentObjects);
    hideCloseWalls();

    renderer.render( scene, camera );

    TWEEN.update();
}

init();



