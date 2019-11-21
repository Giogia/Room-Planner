import * as THREE from 'three';
import _ from 'lodash';

import {canvas, camera, scene} from "./app";
import {floorPlan,  updateScene} from "./walls";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";

import {checkIntersection} from "line-intersect";
import {font, textMaterial} from "./materials";
import {TextGeometry} from "three";

let currentLine;

export function editDrawing(event){

    let position = worldCoordinates(event);
    let point = _.find(floorPlan.points,
        { x: Math.round(position.x * 4)/4, z: Math.round( position.z * 4)/4});

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
    let newLine = {from: points.indexOf(start), to: points.indexOf(end)};
    lines.push(newLine);
    for( let point of points){ point.selected = false}

    // create intersection point if two lines intersect
    for(let intersecting of lines){

        let start2 = points[intersecting.from];
        let end2 = points[intersecting.to];

        let intersection = checkIntersection(start.x, start.z, end.x, end.z, start2.x, start2.z, end2.x, end2.z);

        if( intersection.point ){

            if(!_.find(points, {x: Math.round(intersection.point.x * 4)/4, z: Math.round(intersection.point.y * 4)/4})){

                let intersectionPoint = {x: Math.round(intersection.point.x * 4)/4, z: Math.round(intersection.point.y * 4)/4, selected: false};

                drawPoint(intersectionPoint);

                lines.push({from:points.indexOf(intersectionPoint), to:intersecting.from});
                lines.push({from:points.indexOf(intersectionPoint), to:intersecting.to});
                lines.push({from:points.indexOf(intersectionPoint), to:newLine.from});
                lines.push({from:points.indexOf(intersectionPoint), to:newLine.to});
                _.remove(lines, line => { return line === intersecting || line === newLine});

            }
        }
    }

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

    position.x = Math.round( position.x * 4)/ 4;
    position.z = Math.round( position.z * 4)/ 4;

    return {x: position.x, z: position.z, selected: false}
}


export function addText(message, x, y, z){

    let geometry = new THREE.ShapeBufferGeometry(font.generateShapes(message, 0.1, 100));
    let mesh = new THREE.Mesh(geometry, textMaterial);

    mesh.position.set(x, y, z);
    mesh.rotateX(-Math.PI/2);
    mesh.rotateZ(-Math.PI/2);

    return mesh
}

