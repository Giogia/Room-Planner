'use strict';

import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

import { scene } from './app'

/*
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
*/

export function createGround() {

    let ground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false}));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    let grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    grid.receiveShadow = true;
    scene.add(grid);

    //let axesHelper = new THREE.AxesHelper( 5 );
    //scene.add( axesHelper );
}


export function loadModel(path) {

    let model;
    let loader = new GLTFLoader();

    loader.load(path, function (gltf) {

        model = gltf.scene;
        scene.add(model);

    }, undefined, function (error) {

        console.error(error);

    });
}


// dev function used for debugging
export function randomCubes(){

    let cubes = [];

    let geometry = new THREE.BoxBufferGeometry( 0.4, 0.4, 0.4 );
    for ( let i = 0; i < 20; i ++ ) {
        let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
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
        cubes.push( object );
    }

    return cubes;
}




