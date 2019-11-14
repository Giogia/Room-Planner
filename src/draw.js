import * as THREE from 'three';
import _ from 'lodash';

import {canvas, camera, scene, updateScene} from "./app";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";

export let selected = { points: [], lines:[] };
export let currentLine;

export let floorPlan = {

    points: [
        {x: -5, z: -5, selected:false },
        {x: 0, z: -5, selected:false },
        {x: -5, z: 0, selected:false },
        {x: 0, z: 0, selected:false },
        {x: 5, z: 0, selected:false },
        {x: -5, z: 3, selected:false },
        {x: 0, z: 2, selected:false },
        {x: 1, z: 2, selected:false },
        {x: 5, z: 2, selected:false },
        {x: -5, z: 5, selected:false },
        {x: 1, z: 5, selected:false },
        {x: 5, z: 5, selected:false },
        {x: 0, z: 3, selected:false }
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

    let points = floorPlan.points;
    let selected = _.find(points,{ selected: true });

    points[points.indexOf(point)].selected = !points[points.indexOf(point)].selected;
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
        color: 0xe2a149,
        transparent: true,
        opacity: 0.3,
        linewidth: 0.008,
    });

    let geometry = new LineGeometry();
    geometry.setPositions([point.x, 0.02, point.z, position.x, 0.02, position.z]);

    scene.remove(currentLine);
    currentLine = new Line2(geometry, material);
    scene.add(currentLine);
}


function drawLine(event){

    let points = floorPlan.points;
    let lines = floorPlan.lines;

    let position = worldCoordinates(event);
    let start = _.find(points, {selected: true});
    let end = _.find(points, {x:position.x, z:position.z});

    // fix to avoid drawing line from to same point.
    if(start === end){
        start = _.findLast(points, {selected: true});
    }

    scene.remove(currentLine);
    lines.push({from: points.indexOf(start), to: points.indexOf(end)});
    for( let point of points){ point.selected = false}
    updateScene();

    canvas.removeEventListener( 'mousemove', showLine, false);
    canvas.removeEventListener('click', drawLine, false);
}


export function deleteDrawing(event){

    let points = floorPlan.points;
    let lines = floorPlan.lines;

    let position = worldCoordinates(event);
    let selected = _.find(points,{ x: position.x, z: position.z });

    if(selected){

        _.remove(lines, line => { return line.from === points.indexOf(selected)});
        _.remove(lines, line => { return line.to === points.indexOf(selected)});

        _.map(lines, line =>{
            if(line.to > points.indexOf(selected)){
                line.to--;
            }
            if(line.from > points.indexOf(selected)){
                line.from--;
            }
            return line
        });

        _.remove(points, point => { return point === selected });

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
        return {x: position.x, z: position.z, selected: false}
    }

    return {x: position.x, z: position.z, selected: false}
}