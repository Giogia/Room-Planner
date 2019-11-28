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
        selectFloor(event);
    }
    else if(intersects[i].object.name === "wall"){
        selectWall(event);
    }
    else{
        selectDraggableObject(event);
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


function select(event, objects, onSelect, onAlternativeSelect, onDeselect, recursive=false){

    let intersects = intersect(event, objects);

    let object = null;

    if(intersects.length > 0) {

        object = intersects[0].object;

        if(recursive){
            while (object.type !== 'Scene') {
                object = object.parent;
            }
        }

        if(selectedObject !== object && selectedObject !== null){

            onAlternativeSelect();
            object.overrideMaterial = null;
            selectedObject = null;
        }

        if(selectedObject === null){

            selectedObject = object;
            object.overrideMaterial = selectedMaterial;
            onSelect();
        }

        else if(selectedObject === object){

            onDeselect();
            object.overrideMaterial = null;
            selectedObject = null;

        }
    }
}


function selectFloor(event){

    select(event, floorModel.children,

        async function(){

            let name = floorMaterials[randomInt(0,floorMaterials.length-1)];

            while(name === lastTexture){
                name = floorMaterials[randomInt(0,floorMaterials.length-1)];
            }

            lastTexture = name;
            setTexture(name, selectedObject.material);

            let room = _.find(floorPlan.rooms, {mesh: selectedObject.uuid});
            room.texture = name;

            await saveJson('floorPlan', floorPlan);
        },
        function(){

        },
        function(){

        });
}

function selectWall(event){

    select(event, wallsModel.children,

        async function(){

            let name = wallMaterials[randomInt(0,wallMaterials.length-1)];

            while(name === lastTexture){
                name = wallMaterials[randomInt(0,wallMaterials.length-1)];
            }

            lastTexture = name;
            setTexture(name, selectedObject.material);

            let wall = _.find(floorPlan.walls, {mesh: selectedObject.uuid});
            wall.texture = name;

            await saveJson('floorPlan', floorPlan);
        },
        function(){

        },
        function(){

    });
}


function selectDraggableObject(event){

    select(event, draggableObjects,

        function(){
        showButton(removeButton);
        removeButton.addEventListener('click', removeDraggableObject);
    },

        function(){
        removeButton.removeEventListener('click', removeDraggableObject);
    },
        function(){

        hideButton(removeButton);
        removeButton.removeEventListener('click', removeDraggableObject);
    },
        true);
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





