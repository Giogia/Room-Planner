'use strict';

import _ from 'lodash';
import * as THREE from 'three';
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Line2 } from "three/examples/jsm/lines/Line2";
import Graph from "graph.js/dist/graph.es6";

import {floorPlan} from "./draw";
import { textureLoader } from "./app";
import randomInt from "random-int";
let inside = require("point-in-polygon");


const DEPTH = 0.1;
const HEIGHT = 1.3;

const MATERIAL = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 1});

export function createModel () {

  let points = getPointModels(floorPlan.points);
  let lines = getLineModels(floorPlan);

  let group = new THREE.Group();

  _.each(points, (point) => group.add(point));
  _.each(lines, (line) => group.add(line));

  return group;
}


// TODO creation of a
export function createWallsModel () {

  let columns = getColumnsModels(floorPlan.points);
  let walls = getWallsModels(floorPlan);

  let group = new THREE.Group();

  _.each(walls, (wall) => group.add(wall));
  _.each(columns, (column) => group.add(column));

  return group;
}


function getPointModels (points) {
  return _.map(points, ({id, x, z, selected}) => {
    let geometry = new THREE.SphereBufferGeometry(0.08, 32, 32);

    let material = selected ? new THREE.MeshBasicMaterial({color: 'blue'}): new THREE.MeshBasicMaterial({color: 'white'});

    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.x = x;
    mesh.position.z = z;
    mesh.data = {id};
    return mesh;
  });
}

function getLineModels ({lines, points}) {
  return _.map(lines, ({from, to}) => {

    let material = new LineMaterial({
      color: 0xffffff,
      linewidth: 0.008,
      transparent: true,
      opacity: 0.9
    });

    let geometry = new LineGeometry();
    geometry.setPositions([points[from].x, 0.01, points[from].z, points[to].x, 0.01, points[to].z]);

    let line = new Line2(geometry, material);

    return line
  });
}

function getColumnsModels (points){
  return _.map(points, ({id, x, z})=> {

    let columnGeometry = new THREE.CylinderGeometry(DEPTH/2, DEPTH/2, HEIGHT, 32);
    let columnMesh = new THREE.Mesh(columnGeometry, new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 1}));

    columnMesh.position.set(x, HEIGHT/2 + 0.03, z);
    columnMesh.castShadow = true;
    columnMesh.receiveShadow = true;

    return columnMesh;
  });
}

function getWallsModels ({lines, points}) {
  return _.map(lines, ({from, to}) => {

    let startPoint = points[from];
    let endPoint = points[to];

    let width = Math.hypot(startPoint.x - endPoint.x, startPoint.z - endPoint.z);

    let wallGeometry = new THREE.BoxGeometry(width, HEIGHT, DEPTH);
    let material = new THREE.MeshStandardMaterial({
        roughness: 0.05,
        color: 0xffffff,
        bumpScale: 0.05,
        metalness: 0.02,
        transparent: true,
        opacity: 1,
    });

    textureLoader.load( "assets/plaster_bump.jpg", function ( map ) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( width, HEIGHT);
        material.bumpMap = map;
        material.needsUpdate = true;
    });

    textureLoader.load( "assets/plaster_roughness.jpg", function ( map ) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( width, HEIGHT );
        material.roughnessMap = map;
        material.needsUpdate = true;
    });

    let wallMesh = new THREE.Mesh(wallGeometry, material);

    let offsetX = startPoint.x - endPoint.x;
    let offsetZ = startPoint.z - endPoint.z;

    let angle = -Math.atan(offsetZ / offsetX);


    wallMesh.position.set(endPoint.x + offsetX / 2, HEIGHT / 2 + 0.03, endPoint.z + offsetZ / 2);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wallMesh.rotateY(angle);

    return wallMesh;
  });
}


export function createFloorModel({lines, points}) {

    let graph = new Graph();

    _.each(points, (point) => graph.addVertex(point.id, {value: 1}));
    _.each(lines, (line) => graph.addEdge(line.from, line.to, { value:1}));
    _.each(lines, (line) => graph.addEdge(line.to, line.from, { value:1}));

    let cycles = [];
    let rooms = [];

    // remove 2 points loops
    for (let cycle of graph.cycles()){
        if(cycle.length>2){
          cycles.push(cycle)
        }
    }

    // remove loops containing other loops
    for (let i=0; i<cycles.length; i++) {

        let contained = false;
        for (let j = i + 1; j < cycles.length; j++) {
            if (isSubCycle(cycles[j], cycles[i])) {
                contained = true;
                break;
            }
        }
        if (!contained) {
            rooms.push(cycles[i]);
        }
    }

    let floor = new THREE.Group();
    let centers = [new THREE.Vector3(0,0,0)];
    let extrudeSettings = { depth: 0.03, bevelEnabled: false };

    for( let room of rooms){

        let shape = new THREE.Shape();
        shape.moveTo(points[room[room.length-1]].x, points[room[room.length-1]].z);
        for( let point of room){
            shape.lineTo(points[point].x, points[point].z);
        }

        let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
        geometry.computeBoundingBox();

        let center = geometry.boundingBox.getCenter( new THREE.Vector3());

        let overlapped = false;

        for( let room2 of rooms) {

            if(room !== room2 && room.length >= room2.length){

                let polygon = [];
                _.each(room2, point => { polygon.push([points[point].x, points[point].z])});

                if (inside([center.x, center.y], polygon)) {
                    overlapped = true;
                    break;
                }
            }
        }

        if(!overlapped){

            let material = new THREE.MeshStandardMaterial( {
                            roughness: 1,
                            color: 0xffffff,
                            metalness: 0.02,
                            bumpScale: 2
                        } );

            let angle = Math.PI/2 * randomInt(0,1);
            let choice = Math.floor( 4 * Math.random())+1;

            textureLoader.load( "assets/tiles"+choice+"_diffuse.jpg", function ( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set(2,2);
                map.rotation = angle;
                material.map = map;
                material.needsUpdate = true;
            });
            textureLoader.load( "assets/tiles"+choice+"_bump.jpg", function ( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set(2, 2);
                map.rotation = angle;
                material.bumpMap = map;
                material.needsUpdate = true;
            });
            textureLoader.load( "assets/tiles"+choice+"_roughness.jpg", function ( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set(2, 2);
                map.rotation = angle;
                material.roughnessMap = map;
                material.needsUpdate = true;
            });

            let mesh = new THREE.Mesh( geometry, material );

            mesh.rotateX(Math.PI/2);
            mesh.translateZ(-0.03);
            floor.add(mesh);
            centers.push(new THREE.Vector3(center.x, center.z, center.y));
        }
    }

    let centersGroup = new THREE.Group();
    _.each(getPointModels(centers), (wall) => centersGroup.add(wall));

    return [floor, centersGroup];

}


function isSubCycle(subCycle, cycle){

  return subCycle.every(val => cycle.includes(val));
}



