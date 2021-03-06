'use strict';

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter";

import {camera, scene} from './app';

import * as THREE from 'three';
import {draggableObjects} from "./controls";

let jsonUrl = 'http://localhost:3000/';


export async function loadJson(name){

    let response = await fetch(jsonUrl + name.toString());
    return (await response).json();
}


export async function saveJson(name, data){

    await fetch(jsonUrl + name.toString(),
    {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
}


export async function importModel(name, x=camera.position.x/5, y=0.03, z=camera.position.z/5, angle=0) {

    let path  = './models/furniture/' + name + '.glb';

    let loader = new GLTFLoader();

    let promise = new Promise((resolve, reject) => {
        loader.load(path, resolve, undefined, reject)
    });

    let model = (await promise).scene;
    model.name = name;
    model.castShadow = true;
    model.receiveShadow = true;

    model.position.set(x, y, z);
    model.rotation.y = THREE.Math.degToRad(angle);

    scene.add(model);
    draggableObjects.push(model);

    return model
}


export function exportScene(){

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










