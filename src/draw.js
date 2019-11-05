import * as THREE from 'three';
import _ from 'lodash';

import {canvas, camera, scene, updateScene} from "./app";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";

export let selected = { points: [], lines:[] };
export let currentLine;

//export let floorPlan = { points:[], lines:[] };


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


export function editDrawing(event){

    let position = worldCoordinates(event);
    let point = _.find(floorPlan.points,{ x: position.x, z: position.z });

    if(point){
        selectPoint(point);
    }
    else{
        drawPoint(position);
    }
}


function selectPoint(point){

    let selected = _.find(floorPlan.points,{ selected: true });

    floorPlan.points[point.id].selected = !floorPlan.points[point.id].selected;
    updateScene();

    if(selected === undefined){

        canvas.addEventListener('mousemove', showLine, false);
        canvas.addEventListener('click', drawLine, false);
    }

    if(selected === point){

        canvas.removeEventListener( 'mousemove', showLine, false);
        canvas.removeEventListener('click', drawLine, false);
    }
}


function drawPoint(position){

    floorPlan.points.push(position);
    updateScene();
}


function showLine(event){

    let position = worldCoordinates(event);
    let point = _.find(floorPlan.points,{ selected: true });

    let material = new LineMaterial({
        color: 'blue',
        opacity: 0.5,
        linewidth: 0.08,
    });

    let geometry = new LineGeometry();
    geometry.setPositions([point.x, 0, point.z, position.x, 0, position.z]);

    scene.remove(currentLine);
    currentLine = new Line2(geometry, material);
    scene.add(currentLine);
}


function drawLine(event){

    let position = worldCoordinates(event);
    let start = _.find(floorPlan.points, {selected: true});
    let end = _.find(floorPlan.points, {x:position.x, z:position.z});

    // fix to avoid drawing line from to same point.
    if(start === end){
        start = _.findLast(floorPlan.points, {selected: true});
    }

    scene.remove(currentLine);
    floorPlan.lines.push({from: start.id, to: end.id});
    for( let point of floorPlan.points){ point.selected = false}
    updateScene();

    canvas.removeEventListener( 'mousemove', showLine, false);
    canvas.removeEventListener('click', drawLine, false);
}


export function deleteDrawing(event){

    let position = worldCoordinates(event);
    let selected = _.find(floorPlan.points,{ x: position.x, z: position.z });

    if(selected){

        _.remove(floorPlan.points, function(point) { return point.id === selected.id});
        _.remove(floorPlan.lines, function(line) { return line.from === selected.id});
        _.remove(floorPlan.lines, function(line) { return line.to === selected.id});

        updateScene();
    }
}


export function worldCoordinates(event){

    let vector = new THREE.Vector3();
    let position = new THREE.Vector3();

    vector.set(
        ( event.clientX / canvas.clientWidth ) * 2 - 1,
        - ( event.clientY / canvas.clientHeight ) * 2 + 1,
        -1,
    );

    vector.unproject( camera );
    vector.sub( camera.position ).normalize();

    let distance = - camera.position.y / vector.y;

    position.copy( camera.position ).add( vector.multiplyScalar( distance ) );

    position.x = Math.round( position.x );
    position.z = Math.round( position.z );

    if(floorPlan.points.length === 0){
        return {id: 0, x: position.x, z: position.z, selected: false}
    }

    let lastElementId = floorPlan.points.slice(-1)[0].id;

    return {id: lastElementId+1, x: position.x, z: position.z, selected: false}
}