import * as THREE from 'three';
import {createModel, createWallsModel} from "./floorplan";
import {camera, scene, canvas, floorModel,wallsModel} from "./app";

export let floorPlan = {

    points: [
        {x: -5, z: -5, id: 0},
        {x: 0, z: -5, id: 1},
        {x: -5, z: 0, id: 2},
        {x: 0, z: 0, id: 3},
        {x: 5, z: 0, id: 4},
        {x: -5, z: 3, id: 5},
        {x: 0, z: 2, id: 6},
        {x: 1, z: 2, id: 7},
        {x: 5, z: 2, id: 8},
        {x: -5, z: 5, id: 9},
        {x: 1, z: 5, id: 10},
        {x: 5, z: 5, id: 11},
        {x: 0, z: 3, id: 12}
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
    ]
};


export function drawPoint(event){

    let vector = new THREE.Vector3(); // create once and reuse
    let position = new THREE.Vector3(); // create once and reuse

    vector.set(
        ( event.clientX / canvas.clientWidth ) * 2 - 1,
        0.5,
        ( event.clientY / canvas.clientHeight ) * 2 - 1,
        );

    vector.unproject( camera );
    vector.sub( camera.position ).normalize();

    let distance = - camera.position.y / vector.y;

    position.copy( camera.position ).add( vector.multiplyScalar( distance ) );

    floorPlan.points.push({x: position.x, z: position.z, id: floorPlan.points.length});
    scene.remove(floorModel);
    let newFloorModel = createModel(floorPlan);
    scene.add(newFloorModel);
    console.log(position);

}