import {loadJson, importModel, saveJson} from "./loader";
import * as THREE from "three";
import {camera, canvas, raycaster, scene} from "./app";

export let currentObjects;


export async function initObjects(){

    currentObjects = await loadJson('currentObjects');
    currentObjects.objects.forEach( object => {
        importModel(object.name, object.x, object.y, object.z)
    });
}


export async function addObject(event){

    let name = event.target.id;
    let model = await importModel(name);

    let object = { name: model.name, x: model.position.x, y: model.position.y, z: model.position.z };
    currentObjects.objects.push(object);
    await saveJson('currentObjects', currentObjects);
}


export function selectObject(event){

    let mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / canvas.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / canvas.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children, true);

    //TODO add action for objects

    console.log(intersects);

    return intersects
}


