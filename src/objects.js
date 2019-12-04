import {importModel, loadJson, saveJson} from "./loader";
import * as THREE from "three";
import {camera, canvas, raycaster, scene} from "./app";
import {dragControls, draggableObjects} from "./controls";
import {hideButton, removeButton, showButton} from "./buttons";
import {selectedMaterial, setTexture} from "./materials";
import {floorModel, floorPlan, wallsModel} from "./walls";
import {floorMaterials, wallMaterials} from "./materialsList";
import {radiansToDegrees} from "@google/model-viewer/lib/styles/conversions";

export let currentObjects;
export let selectedObject = null;
let lastFloorTexture = 'wood2';
let lastWallTexture = 'plaster';


export async function initObjects(){

    currentObjects = await loadJson('currentObjects');
    currentObjects.objects.forEach( object => {
        importModel(object.name, object.x, object.y, object.z, object.angle)
    });
}


export async function addObject(event){

    let name = event.target.id;
    let model = await importModel(name);

    let object = { name: model.name, x: model.position.x, y: model.position.y, z: model.position.z, angle: model.rotation.y };
    currentObjects.objects.push(object);
    await saveJson('currentObjects', currentObjects);
}


export async function selectObject(event){

    let intersects = intersect(event, scene.children);

    let i = 0;
    while (intersects[i].object.name === "" || (intersects[i].object.name === "wall" && intersects[i].distance < 10)) {
        if(i===intersects.length-1){
            return;
        }
        i++;
    }

    if (intersects[i].object.name === "floor") {
        lastFloorTexture = await updateTexture(intersects[i].object, floorPlan.rooms, floorMaterials, lastFloorTexture);
    } else if (intersects[i].object.name === "wall") {
        lastWallTexture = await updateTexture(intersects[i].object, floorPlan.walls, wallMaterials, lastWallTexture);
    } else{
        rotateDraggableObject(intersects[i].object);
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


async function updateTexture(object, objects, materials, lastTexture){

    let mesh = _.find(objects, {mesh: object.uuid});

    let texture = mesh.texture;

    if(texture === lastTexture){
       texture = materials[(materials.indexOf(lastTexture) + 1) % materials.length];
    }
    else if(texture !== lastTexture){
        texture = lastTexture;
    }

    let repeat = object.geometry.parameters.width? [object.geometry.parameters.width, 1] : [2,2];

    setTexture(texture, object.material, repeat);
    mesh.texture = texture;

    await saveJson('floorPlan', floorPlan);

    return texture;
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


export async function rotateDraggableObject(object){

    while (object.type !== 'Scene') {
        object = object.parent;
    }

    object.rotation.y = (object.rotation.y + Math.PI/2) % (2 * Math.PI);

    let dragged = _.find(currentObjects.objects, {name: object.name});
    dragged.angle = THREE.Math.radToDeg(object.rotation.y);

    await saveJson('currentObjects', currentObjects);
}





