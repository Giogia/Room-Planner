import {loadJson, importModel, saveJson} from "./loader";
import * as THREE from "three";
import {animate, camera, canvas, raycaster, renderer, scene} from "./app";
import {dragControls, draggableObjects, mapControls, orbitControls} from "./controls";
import {
    hideButton,
    removeButton,
    showButton
} from "./buttons";
import {selectedMaterial} from "./materials";

export let currentObjects;
export let selectedObject = null;


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
    mouse.z = 0.5;

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( draggableObjects, true);

    let object = null;

    if(intersects.length > 0){

        object = intersects[0].object;

        while(object.type !== 'Scene'){
            object = object.parent;
        }

        if(selectedObject !== object){

            object.overrideMaterial = null;
            selectedObject = null;
            removeButton.removeEventListener('click', removeObject);
        }

        if(selectedObject === null){

            selectedObject = object;

            object.overrideMaterial = selectedMaterial;
            showButton(removeButton);
            removeButton.addEventListener('click', removeObject);
        }

        else if(selectedObject === object){

            hideButton(removeButton);
            object.overrideMaterial = null;
            selectedObject = null;
            removeButton.removeEventListener('click', removeObject);
        }
    }
}


export async function removeObject(){

    scene.remove(selectedObject);

    _.remove(draggableObjects, draggable => { return draggable.uuid === selectedObject.uuid});
    _.remove(currentObjects.objects, current => { return (current.name === selectedObject.name
        && current.x === selectedObject.position.x
        && current.y === selectedObject.position.y
        && current.z === selectedObject.position.z)});
     await saveJson('currentObjects', currentObjects);

     hideButton(removeButton);
     console.log(removeButton);
     removeButton.removeEventListener('click', removeObject);
     selectedObject = null;
}


