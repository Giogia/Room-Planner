'use strict';
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { scene, currentObjects } from './app';

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

function loadObject(name){

    let loading = loadModel(name);

    loading.then( gltf => {

        let model = gltf.scene;
        model.name = name;

        console.log(model)

        currentObjects.push(model);
    });
}


export function addObject(event){

    let name = event.target.id;

    loadObject(name)

}





