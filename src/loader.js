'use strict';

import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter";

import {scene, currentObjects, renderer, camera, backgroundObjects, ground} from './app';
import randomInt from 'random-int'
import {plants, trees, rocks, mountains} from "./objects";

import * as THREE from 'three';
import {transformControls} from "./controls";


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

        new THREE.Box3().setFromObject( model ).getCenter( model.position ).multiplyScalar( - 1 );

        model.position.set(camera.position.x/4, 0.03, camera.position.z/4);

        currentObjects.push(model);
    });
}


// TODO make function dependent only on path not list
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
            model.rotation.set(0, angle, 0);

            backgroundObjects.push(model);
        });
    }
}


export function randomBackgroundObjects(treesNumber=3000, plantsNumber=300, rocksNumber=50, mountainsNumber=50){

    loadFromList(trees, 'trees', treesNumber, 50, 120);
    loadFromList(trees, 'trees', treesNumber, 125, 150);
    loadFromList(plants, 'plants', plantsNumber, 40, 50);
    loadFromList(plants, 'plants', plantsNumber, 55, 70);
    loadFromList(rocks, 'rocks', rocksNumber, 35, 50);
    loadFromList(mountains, 'mountains', mountainsNumber, 150, 200);
    loadFromList(['grass'], 'plants', plantsNumber, 20, 50);
    loadFromList(['grass'], 'plants', plantsNumber, 55, 60);

}


export function loadScene(name){
    let loader = new GLTFLoader();

    loader.load(name, gltf => {

        console.log("Adding Scene");

        let model = gltf.scene;
        scene.add(model);
        renderer.render(scene, camera);
        currentObjects.push(model);
    },
        function(){},

        error => {
        console.log(error);
        });
}


export function saveScene(){

    let exporter = new GLTFExporter();

    exporter.parse( scene.children, function ( glb ) {

    let link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link );

    link.href = URL.createObjectURL(new Blob( [glb], { type: 'application/octet-stream' } ));
    link.download = 'scene.glb';
    link.click();

    },{ binary:true });
}








