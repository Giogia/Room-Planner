'use strict';

import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { scene, currentObjects, trees } from './app';
import randomInt from 'random-int'

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

    let name = event.target.id;

    let loading = loadModel(name);

    loading.then( gltf => {

        let model = gltf.scene;
        model.name = name;

        let low = 0;
        let high = 5;

        model.position.set(randomInt(low,high), 0, randomInt(low,high));

        currentObjects.push(model);
    });
}


export function randomTrees(number=500){

    for(let i = 0; i < number; i++) {

        let name = 'washer';

        let loading = loadModel(name);

        loading.then( gltf => {

        let model = gltf.scene;
        model.name = name;

        let low = 10;
        let high = 50;

        let X = randomInt(low, high);

        let Z = Math.sqrt(randomInt(low, high) - Math.pow( X,2));

        model.position.set(X, 0, Z);

        trees.push(model);
        });
    }
}





