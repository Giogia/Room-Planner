'use strict';

import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter";

import {scene, currentObjects, renderer, camera, wallsModel} from './app';
import randomInt from 'random-int'
import {plants, trees, rocks, mountains} from "./objects";

async function loadModel(path){

    let model = null;
    let loader = new GLTFLoader();

    let promise = new Promise((resolve, reject) => {
        loader.load(path, resolve, undefined, reject)
    });

    await promise.then(gltf => {
        model = gltf.scene;
        model.castShadow = true;
        model.receiveShadow = true;

        scene.add(model);

    }, error => {
        console.error(error);
    });

    return promise;
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

            model.position.set(x, 0, z);
        });
    }
}


export function randomBackgroundObjects(treesNumber=1000, plantsNumber=100, rocksNumber=50){

    loadFromList(trees, 'trees', treesNumber, 20, 60);
    loadFromList(trees, 'trees', treesNumber, 65, 250);
    loadFromList(plants, 'plants', plantsNumber, 20, 30);
    loadFromList(plants, 'plants', plantsNumber, 35, 50);
    loadFromList(rocks, 'rocks', rocksNumber, 15, 30);
    //loadFromList(mountains, 'mountains', 5, 200, 250)

}


export function loadScene(name){
    let loader = new GLTFLoader();

    loader.load(name, gltf => {

        scene.add(gltf.scene);
        renderer.render(scene, camera);
    }, undefined,

    error => {
      console.log(error);
    });
}


export function saveScene(){

    let exporter = new GLTFExporter();

    exporter.parse( currentObjects, function ( glb ) {

        let link = document.createElement( 'a' );
        link.style.display = 'none';
        document.body.appendChild( link );

        link.href = URL.createObjectURL(new Blob( [glb], { type: 'application/octet-stream' } ));
        link.download = 'scene.glb';
        link.click();

    },{ binary:true });
}








