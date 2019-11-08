'use strict';

import _ from 'lodash';
import * as THREE from 'three';
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Line2 } from "three/examples/jsm/lines/Line2";
import Graph from "graph.js/dist/graph.es6";

import {floorPlan} from "./draw";


const DEPTH = 0.1;
const HEIGHT = 1.3;

const MATERIAL = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.95});

export let floor;

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

  floor = drawFloor(floorPlan);
  group.add(floor);


  //let floor = drawFloor([floorplan.points[0], floorplan.points[1], floorplan.points[2], floorplan.points[3]]);
  //let floor2 = drawFloor([floorplan.points[2], floorplan.points[4], floorplan.points[9], floorplan.points[11]]);
  //group.add(floor);
  //group.add(floor2);

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
    geometry.setPositions([points[from].x, 0, points[from].z, points[to].x, 0, points[to].z]);

    let line = new Line2(geometry, material);
    line.translateY(0.01);

    return line
  });
}

function getColumnsModels (points){
  return _.map(points, ({id, x, z})=> {

    let columnGeometry = new THREE.CylinderGeometry(DEPTH/2, DEPTH/2, HEIGHT, 32);
    let columnMesh = new THREE.Mesh(columnGeometry, MATERIAL);

    columnMesh.position.set(x, HEIGHT/2, z);
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
    let wallMesh = new THREE.Mesh(wallGeometry, MATERIAL);

    let offsetX = startPoint.x - endPoint.x;
    let offsetZ = startPoint.z - endPoint.z;

    let angle = -Math.atan(offsetZ / offsetX);


    wallMesh.position.set(endPoint.x + offsetX / 2, HEIGHT / 2, endPoint.z + offsetZ / 2);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wallMesh.rotateY(angle);

    return wallMesh;
  });
}


function drawFloor({lines, points}) {

  let graph = new Graph();

  _.each(points, (point) => graph.addVertex(point.id, {value: 1}));
  _.each(lines, (line) => graph.addEdge(line.from, line.to, { value:1}));
  _.each(lines, (line) => graph.addEdge(line.to, line.from, { value:1}));

  let cycles = [];

  // remove cycles on two nodes
  for (let cycle of graph.cycles()){
    if(cycle.length>2){
      cycles.push(cycle)
    }
  }

  let rooms = [];

  for (let cycle of cycles) {
    let subCycle = false;
    for (let cycle2 of cycles) {
        if(isSubCycle(cycle2, cycle)) {
          subCycle = true;
          break;
        }
      }

    if(!subCycle){
      rooms.push(cycle);
    }
  }

  console.log(rooms);

  floor = new THREE.Group();

  for( let room of rooms){
    let shape = new THREE.Shape();
    shape.moveTo(points[room[room.length-1]].x, points[room[room.length-1]].z);
    for( let point of room){
      shape.lineTo(points[point].x, points[point].z);
    }

    let extrudeSettings = { depth: 0.01, bevelEnabled: false };

    let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);

    let material = new THREE.MeshPhongMaterial( { color: 0xd6b68b } );

    let mesh = new THREE.Mesh( geometry, material );

    mesh.rotateX(Math.PI/2);
    mesh.translateZ(-0.01);
    floor.add(mesh);
  }

  return floor

}

function isSubCycle(subCycle, cycle){

  return (_.isEqual(_.sortBy(subCycle), _.sortBy(cycle)) ? false : subCycle.every(val => cycle.includes(val)));
}

