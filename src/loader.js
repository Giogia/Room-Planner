'use strict';

import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { scene, currentObjects } from './app';
import randomInt from 'random-int'
import {plants, trees, rocks} from "./objects";
import {floorPlan} from "./draw";

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


function loadFromList(list, listName, number, near, far){

    for(let i = 0; i < number; i++) {

        let name = list[Math.floor(Math.random() * list.length)];
        let path  = './models/nature/' + listName + '/' + name + '.glb';

        let loading = loadModel(path);

        loading.then( gltf => {

            let model = gltf.scene;
            model.name = name;

            let radius = randomInt(near, far);
            let angle = 2 * Math.PI * i / number;

            let x = Math.sin(angle) * radius;
            let z = Math.cos(angle) * radius;

            console.log(x,z);

            model.position.set(x, 0, z);
        });
    }
}


export function randomBackgroundObjects(treesNumber=1000, plantsNumber=100, rocksNumber=50){

    loadFromList(trees, 'trees', treesNumber, 20, 30);
    loadFromList(trees, 'trees', 2*treesNumber, 35, 70);
    loadFromList(plants, 'plants', 2*plantsNumber, 15, 20);
    loadFromList(plants, 'plants', plantsNumber, 20, 30);
    loadFromList(rocks, 'rocks', rocksNumber, 12, 30);

}







