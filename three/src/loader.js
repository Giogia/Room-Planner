'use strict';

import * as THREE from 'three';
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { scene, currentObjects } from './app';
import {dragControls} from "./controls";


async function loadModel(object){

    let path  = './models/gltf/' + object + '.glb';
    let model = null;
    let loader = new GLTFLoader();

    let promise = new Promise((resolve, reject) => {
        loader.load(path, resolve, undefined, reject)
    });

    promise.then( gltf => {
        model = gltf.scene;
        model.castShadow = true;
        model.receiveShadow = true;

        scene.add(model);

    }, error => {
        console.error(error);
    });

    return await promise;
}


export function addObject(event){

    event.preventDefault();
    let name = event.target.alt;

    let loading = loadModel(name);

    loading.then( gltf => {

        let model = gltf.scene;
        model.name = name;

        currentObjects.push(model);

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






