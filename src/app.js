'use strict';

import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import {enableOrbitControls, enableMapControls, enableDragControls, orbitControls, mapControls, dragControls} from "./controls";
import { addLights } from './lights';
import {addObject, loadScene, randomBackgroundObjects} from "./loader";
import {createFloorModel, createModel, createWallsModel} from "./walls";
import {hide, hideCloseWalls, showRoomCenters, tweenCamera} from "./view";
import {floorPlan} from "./draw";
import {createButtons} from "./buttons";
import {MDCDrawer} from "@material/drawer/component";

export var scene, camera, renderer, canvas, raycaster, textureLoader;
export var ground;
export var currentObjects = [];
export var backgroundObjects = [];
export let drawModel, floorModel, wallsModel, roomCenters;
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
        createTextureLoader();

        addLights();
        createGround();

        enableOrbitControls();
        enableMapControls();
        enableDragControls();

        list.addEventListener('click', addObject, false);
        canvas.addEventListener('dblclick', selectObject, false);

        drawModel = createModel(floorPlan);
        scene.add(drawModel);
        hide(drawModel.children);

        floorModel = createFloorModel(floorPlan)[0];
        scene.add(floorModel);

        roomCenters = createFloorModel(floorPlan)[1];
        scene.add(roomCenters);

        wallsModel = createWallsModel(floorPlan);
        scene.add(wallsModel);

        //randomBackgroundObjects();
        loadScene('background.glb');

        autoResize();

        animate();

        setTimeout(function(){
            loadingAnimation();
        }, 2000);

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
    scene.background = new THREE.Color(0xddeeff);
    scene.fog = new THREE.Fog(0xddeeff, 45, 200);
}

function createCamera(){
    const fov = 25;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.01;
    const far = 200;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(8, 12, 12);
}


function createRayCaster() {
    raycaster = new THREE.Raycaster();
}

function createTextureLoader(){
    textureLoader = new THREE.TextureLoader();
}

function createGround() {

    let material = new THREE.MeshStandardMaterial( {
                            roughness: 1,
                            color: 0xffffff,
                            metalness: 0.02,
                            bumpScale: 1
                        } );

    ground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        new THREE.MeshLambertMaterial({ color: 0x202020, opacity: 0.75 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    ground.receiveShadow = true;

    scene.add(ground);

    //let axesHelper = new THREE.AxesHelper( 50 );
    //scene.add( axesHelper );
}


function loadingAnimation(){

    let loading = document.getElementById('loading');
    loading.style.opacity = '0';

    tweenCamera(new THREE.Vector3(6, 8, 8), 3000);

}


function autoResize(){
    window.onresize = function () {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    };
}


export function updateScene(){

    scene.remove(drawModel);
    drawModel = createModel(floorPlan);
    scene.add(drawModel);
}

export function updateModel(){

    scene.remove(floorModel);
    floorModel = createFloorModel(floorPlan)[0];
    scene.add(floorModel);
    hide(floorModel.children);

    scene.remove(roomCenters);
    roomCenters = createFloorModel(floorPlan)[1];
    scene.add(roomCenters);
    hide(roomCenters.children);

    scene.remove(wallsModel);
    wallsModel = createWallsModel(floorPlan);
    scene.add(wallsModel);
    hide(wallsModel.children);
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


function animate() {

    requestAnimationFrame( animate );

    TWEEN.update();

    orbitControls.update();
    mapControls.update();
    dragControls.update(currentObjects);

    hideCloseWalls();
    showRoomCenters();

    renderer.render( scene, camera );
}

init();



