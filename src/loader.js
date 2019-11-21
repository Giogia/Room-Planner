'use strict';

import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter";

import {scene, currentObjects, renderer, camera, backgroundObjects, ground} from './app';
import randomInt from 'random-int'
import {plants, trees, rocks, mountains} from "./objects";

import * as THREE from 'three';


async function loadModel(name, x=camera.position.x/4, y=0.03, z=camera.position.z/4) {

    let path  = './models/furniture/' + name + '.glb';

    let loader = new GLTFLoader();

    let promise = new Promise((resolve, reject) => {
        loader.load(path, resolve, undefined, reject)
    });

    let model = (await promise).scene;
    model.name = name;
    model.castShadow = true;
    model.receiveShadow = true;

    new THREE.Box3().setFromObject( model ).getCenter( model.position ).multiplyScalar( - 1 );
    model.position.set(x, y, z);

    scene.add(model);
    currentObjects.push(model);
}


export async function addObject(event){

    let name = event.target.id;

    await loadModel(name)
}


export async function loadJson(name){

    let response = await fetch('http://localhost:63342/Room-Planner/json/'+ name.toString()+ '.json');
    return (await response).json();
}


async function saveJson(name, payload){

    let data = new FormData();
    data.append( 'http://localhost:63342/Room-Planner/json/'+ name.toString(), JSON.stringify( payload ) );

    fetch('http',
    {
        method: "POST",
        body: data
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ alert( JSON.stringify( data ) ) })
}


export async function loadScene(){

    let objects = await loadJson('objects');

    objects.forEach( object => {
        loadModel(object.name, object.x, object.y, object.z)
    });
}


async function dirList(name){

    let response = await fetch()
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









