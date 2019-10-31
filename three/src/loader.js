'use strict';

import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { scene, currentObjects, trees } from './app';
import randomInt from 'random-int'
import {natureObjects} from "./objects";

async function loadModel(path){

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

    let name = event.target.id;
    let path  = './models/furniture/' + name + '.glb';

    let loading = loadModel(path);

    loading.then( gltf => {

        let model = gltf.scene;
        model.name = name;

        let low = 0;
        let high = 5;

        model.position.set(randomInt(low,high), 0, randomInt(low,high));

        currentObjects.push(model);
    });
}


export function randomBackgroundObjects(number=500){

    for(let i = 0; i < number; i++) {

        let name = natureObjects[Math.floor(Math.random() * natureObjects.length)];
        let path  = './models/nature/' + name + '.glb';

        let loading = loadModel(path);

        loading.then( gltf => {

        let model = gltf.scene;
        model.name = name;

        let low = 10;
        let high = 50;

        let radius = randomInt(low, high);
        let angle = randomInt(0, 2 * Math.PI);

        let x = Math.sin(angle) * radius;
        let z = Math.cos(angle) * radius;

        model.position.set(x, 0, z);

        trees.push(model);
        });
    }
    console.log(trees);
}





