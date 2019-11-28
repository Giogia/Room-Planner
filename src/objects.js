import {importModel, loadJson, saveJson} from "./loader";
import * as THREE from "three";
import {camera, canvas, raycaster, scene} from "./app";
import {draggableObjects} from "./controls";
import {hideButton, removeButton, showButton} from "./buttons";
import {selectedMaterial, setTexture} from "./materials";
import {floorModel, floorPlan, wallsModel} from "./walls";
import {floorMaterials, wallMaterials} from "./materialsList";
import randomInt from "random-int";

export let currentObjects;
export let selectedObject = null;
let lastTexture;


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

    let intersects = intersect(event, scene.children);

    let i = 0;
    while(intersects[i].object.name === ""){
        i++
    }
    if(intersects[i].object.name === "floor"){
        updateTexture(event, floorModel.children, floorPlan.rooms, floorMaterials);
    }
    else if(intersects[i].object.name === "wall"){
        updateTexture(event, wallsModel.children, floorPlan.walls, wallMaterials);
    }
}


function intersect(event, objects){

    let mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / canvas.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / canvas.clientHeight ) * 2 + 1;
    mouse.z = 0.5;

    raycaster.setFromCamera( mouse, camera );

    return raycaster.intersectObjects( objects, true);
}


async function updateTexture(event, models, objects, materials){

    let intersects = intersect(event, models);

    let object = null;

    if(intersects.length > 0) {

        object = intersects[0].object;

        let name = materials[randomInt(0, materials.length-1)];

        while(name === lastTexture){
            name = materials[randomInt(0, materials.length-1)];
        }

        lastTexture = name;
        setTexture(name, object.material);

        let room = _.find(objects, {mesh: object.uuid});
        room.texture = name;

        await saveJson('floorPlan', floorPlan);

    }
}


export function selectDraggableObject(event){

    let intersects = intersect(event, draggableObjects);

    let object = null;

    if(intersects.length > 0) {

        object = intersects[0].object;

        while (object.type !== 'Scene') {
            object = object.parent;
        }

        if(selectedObject !== object && selectedObject !== null){

            removeButton.removeEventListener('click', removeDraggableObject);
            object.overrideMaterial = null;
            selectedObject = null;
        }

        if(selectedObject === null){

            selectedObject = object;
            object.overrideMaterial = selectedMaterial;
            showButton(removeButton);
            removeButton.addEventListener('click', removeDraggableObject);
        }

        else if(selectedObject === object){

            hideButton(removeButton);
            removeButton.removeEventListener('click', removeDraggableObject);
            object.overrideMaterial = null;
            selectedObject = null;

        }
    }
}


export async function removeDraggableObject(){

    scene.remove(selectedObject);

    _.remove(draggableObjects, draggable => { return draggable.uuid === selectedObject.uuid});
    _.remove(currentObjects.objects, current => { return (current.name === selectedObject.name
        && current.x === selectedObject.position.x
        && current.y === selectedObject.position.y
        && current.z === selectedObject.position.z)});
     await saveJson('currentObjects', currentObjects);

     hideButton(removeButton);
     removeButton.removeEventListener('click', removeDraggableObject);
     selectedObject = null;
}





