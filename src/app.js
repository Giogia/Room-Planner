'use strict';

import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import { enableOrbitControls, enableMapControls, enableDragControls, enableTransformControls} from "./controls"
import {orbitControls, mapControls, transformControls, dragControls} from "./controls";

import { addLights } from './lights';
import {addObject, loadScene, randomBackgroundObjects} from "./loader";
import {createFloorModel, createDrawModel, createWallsModel } from "./walls";
import {hide, hideCloseWalls, showRoomCenters, tweenCamera} from "./view";
import {createButtons} from "./buttons";
import {MDCDrawer} from "@material/drawer/component";

export var scene, camera, renderer, canvas, raycaster;
export var ground;
export var currentObjects = [];
export var backgroundObjects = [];
export var drawModel, floorModel, wallsModel, skirtingModel, roomCenters;
export let list, drawer;


function init(){

    document.addEventListener('DOMContentLoaded', (event) => {

        canvas = document.getElementById( 'canvas');
        document.body.appendChild(canvas);

        list = document.getElementById('list');

        createDrawer();
        createButtons();

        createRenderer();
        createScene();
        createCamera();
        createRayCaster();

        enableOrbitControls();
        enableMapControls();
        enableDragControls();
        enableTransformControls();

        addLights();
        addGround();

        list.addEventListener('click', addObject, false);
        canvas.addEventListener('dblclick', selectObject, false);

        drawModel = createDrawModel();
        scene.add(drawModel);
        hide(drawModel.children);

        floorModel = createFloorModel()[0];
        scene.add(floorModel);

        roomCenters = createFloorModel()[1];
        scene.add(roomCenters);

        skirtingModel = createWallsModel(true);
        scene.add(skirtingModel);

        wallsModel = createWallsModel();
        scene.add(wallsModel);

        //randomBackgroundObjects();
        //loadScene('background.glb');

        autoResize();

        animate();

        setTimeout(function(){
            loadingAnimation();
        }, 1000);

    });
}


function createDrawer() {
    drawer = new MDCDrawer.attachTo(document.getElementsByClassName("mdc-drawer")[0]);
    drawer.open = true;
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
    scene.background = new THREE.Color(0x606060);
    scene.fog = new THREE.Fog(0x606060, 15, 60);
}


function createCamera(){
    const fov = 25;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.01;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(8, 12, 12);
}


function createRayCaster() {
    raycaster = new THREE.Raycaster();
}


function addGround() {

    ground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(100, 100),
        new THREE.MeshPhongMaterial( {
						color: 0x020202,
						depthWrite: false
					}));

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;

    scene.add(ground);

    //let axesHelper = new THREE.AxesHelper( 50 );
    //scene.add( axesHelper );
}


function loadingAnimation(){

    let loading = document.getElementById('loading');
    loading.style.opacity = '0';

    tweenCamera(new THREE.Vector3(-7, 9, -16), 3000);

}


function autoResize(){
    window.onresize = function () {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    };
}


export function selectObject(event){

    let mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / canvas.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / canvas.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    console.log('current', currentObjects);

    let intersects = raycaster.intersectObjects( scene.children );
    console.log('intersected', intersects);

    for (let intersect of intersects) {

        if(intersect.object.type == "Scene"){
             intersect.object.material.opacity = 0.2;
        }
	}
}


export function updateScene(){

    scene.remove(drawModel);
    drawModel = createDrawModel();
    scene.add(drawModel);
}


export function updateModel(){

    scene.remove(floorModel);
    floorModel = createFloorModel()[0];
    scene.add(floorModel);
    hide(floorModel.children);

    scene.remove(roomCenters);
    roomCenters = createFloorModel()[1];
    scene.add(roomCenters);
    hide(roomCenters.children);

    scene.remove(wallsModel);
    wallsModel = createWallsModel();
    scene.add(wallsModel);
    hide(wallsModel.children);

    scene.remove(skirtingModel);
    skirtingModel = createWallsModel(true);
    scene.add(skirtingModel);
    hide(skirtingModel.children);
}


export function animate() {

    requestAnimationFrame( animate );

    TWEEN.update();

    orbitControls.update();
    mapControls.update();
    dragControls.update(currentObjects);

    hideCloseWalls();
    showRoomCenters();

    renderer.render( scene, camera );
    console.log(camera.position);
}

init();



