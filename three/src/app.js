'use strict';

import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import OrbitControls from 'three-orbitcontrols';
import { DragControls } from 'three-controls';
import { MapControls } from 'three-controls';
import * as TWEEN from 'tween';

import { addLights } from './lights.js';


var scene, camera, renderer, orbitControls, mapControls, dragControls;

var objects = [];

var floorPlanView = false;

var defaultFloorPlan = {
    points: [
        {x: 0, z: 0, id: 0},
        {x: 0, z: 400, id: 1},
        {x: 500, z: 0, id: 2},
        {x: 500, z: 200, id: 3}
    ],

    lines: [
        {from: 0, to: 1},
        {from: 0, to: 2},
        {from: 2, to: 3}
    ]
};

function init() {

    createRenderer();
    createScene();
    createCamera();

    enableOrbitControls();
    enableMapControls();

    camera.position.set(6, 2, 8);

    addLights(scene);

    // create plane
    var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
    }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    grid.receiveShadow = true;
    scene.add(grid);

    var axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    var model;

    var loader = new GLTFLoader();
    loader.load('./models/gltf/wall.glb', function (gltf) {

        model = gltf.scene;
        //model.position.set( 1, 1, 0 );


        scene.add(model);

    }, undefined, function (error) {

        console.error(error);

    });




    var geometry = new THREE.BoxBufferGeometry( 0.4, 0.4, 0.4 );
    for ( var i = 0; i < 20; i ++ ) {
        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        object.position.x = Math.random() * 10 - 5;
        object.position.y = 0;
        object.position.z = Math.random() * 8 - 4;
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add( object );
        objects.push( object );
    }

    enableDragControls()



    document.addEventListener('keypress', onKeyPress);

    window.onresize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    animate();
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

function  enableOrbitControls(){

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

function enableMapControls(){

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

function enableDragControls(){

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

function onKeyPress(event) {

    event.preventDefault();
    if (event.code === "Space" && !floorPlanView) {
        floorView();

    }
    if (event.code === "Space" && floorPlanView) {
        modelView();

    }
    floorPlanView = !floorPlanView;
};

function floorView() {
    tweenCamera(new THREE.Vector3(0, 10, 0.5));

};


function modelView(){
    mapControls.reset();
    tweenCamera(new THREE.Vector3(6, 2, 8));

};

function tweenCamera(targetPosition){

    orbitControls.enabled = false;
    mapControls.enabled = false;
    dragControls.enabled = false;

    const duration = 2000;

    var position = new THREE.Vector3().copy(camera.position);

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
                hide();
            }
            else {
                orbitControls.enabled = true;
                dragControls.enabled = true;
            }
        } )
        .start();
};


function hide(mesh) {
    mesh.traverse(function(child) {
        var z = document.getElementById("cameras").selectedIndex * 5 - 10;
        if (z === -10) {
            child.visible = true;
        } else if (child.position.z !== z) {
            child.visible = false;
        } else {
            child.visible = true;
        };
    });
}





function animate() {

    requestAnimationFrame( animate );

    orbitControls.update();
    mapControls.update();

    renderer.render( scene, camera );

    TWEEN.update();
}

init();
