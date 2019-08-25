import * as THREE from 'three';
import _ from 'lodash';

import {createModel} from "./floorplan";
import {camera, scene, canvas, floorModel} from "./app";

export let selected = { points: [], lines:[] };

export let floorPlan = {

    points: [
        {id: 0, x: -5, z: -5, selected:false },
        {id: 1, x: 0, z: -5, selected:false },
        {id: 2, x: -5, z: 0, selected:false },
        {id: 3, x: 0, z: 0, selected:false },
        {id: 4, x: 5, z: 0, selected:false },
        {id: 5, x: -5, z: 3, selected:false },
        {id: 6, x: 0, z: 2, selected:false },
        {id: 7, x: 1, z: 2, selected:false },
        {id: 8, x: 5, z: 2, selected:false },
        {id: 9, x: -5, z: 5, selected:false },
        {id: 10, x: 1, z: 5, selected:false },
        {id: 11, x: 5, z: 5, selected:false },
        {id: 12, x: 0, z: 3, selected:false }
    ],

    lines: [
        {from: 0, to: 1},
        {from: 0, to: 2},
        {from: 1, to: 3},
        {from: 2, to: 3},
        {from: 2, to: 5},
        {from: 3, to: 4},
        {from: 3, to: 6},
        {from: 4, to: 8},
        {from: 5, to: 12},
        {from: 5, to: 9},
        {from: 6, to: 7},
        {from: 6, to: 12},
        {from: 7, to: 8},
        {from: 7, to: 10},
        {from: 8, to: 11},
        {from: 9, to: 10},
        {from: 10, to: 11}
    ],
};


export function drawPoint(event){

    let position = worldCoordinates(event);

    floorPlan.points.push(position);

    updateScene();
}

export function selectPoint(event){

    let position = worldCoordinates(event);

    let index = _.findIndex(floorPlan.points, position);

    console.log(index);

    updateScene();
}


function worldCoordinates(event){

    let vector = new THREE.Vector3(); // create once and reuse
    let position = new THREE.Vector3(); // create once and reuse

    vector.set(
        ( event.clientX / canvas.clientWidth ) * 2 - 1,
        - ( event.clientY / canvas.clientHeight ) * 2 + 1,
        -1,
    );

    vector.unproject( camera );
    vector.sub( camera.position ).normalize();

    let distance = - camera.position.y / vector.y;

    position.copy( camera.position ).add( vector.multiplyScalar( distance ) );

    position.x = Math.round(position.x * 10) / 10;
    position.z = Math.round( position.z * 10) / 10;

    return {id: floorPlan.points.length, x: position.x, z: position.z, selected: false}
}

function updateScene(){

    scene.remove(floorModel);
    let newFloorModel = createModel(floorPlan);
    scene.add(newFloorModel);
}