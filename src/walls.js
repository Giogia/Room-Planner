'use strict';

import _ from 'lodash';
import * as THREE from 'three';
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Line2 } from "three/examples/jsm/lines/Line2";
import Graph from "graph.js/dist/graph.es6";

let inside = require("point-in-polygon");
import {floorMaterial, skirtingMaterial} from "./materials";
import {hide} from "./view";
import {scene} from "./app";
import {loadJson} from "./loader";

export const DEPTH = 0.05;
export const HEIGHT = 1.3;

export let floorPlan;
export let drawModel, floorModel, wallsModel, skirtingModel, roomCenters;

export async function createModel (){

    floorPlan = await loadJson('floorplan');
    console.log(floorPlan);

    drawModel = createDrawModel();
    scene.add(drawModel);
    hide(drawModel.children);

    floorModel = createFloorModel()[0];
    scene.add(floorModel);

    roomCenters = createFloorModel()[1];
    scene.add(roomCenters);

    skirtingModel = createWallsModel(true);
    scene.add(skirtingModel);

    wallsModel = createWallsModel();
    scene.add(wallsModel);
}


export function createDrawModel () {

  let points = getPointModels(floorPlan.points);
  let lines = getLineModels(floorPlan);

  let group = new THREE.Group();

  _.each(points, (point) => group.add(point));
  _.each(lines, (line) => group.add(line));

  return group;
}

export function createWallsModel (skirting=false) {

  let columns = getColumnsModels(floorPlan.points, skirting);
  let walls = getWallsModels(floorPlan, skirting);

  let group = new THREE.Group();

  _.each(walls, (wall) => group.add(wall));
  _.each(columns, (column) => group.add(column));

  return group;
}


function getPointModels (points) {
  return _.map(points, ({x, z, selected}) => {

      let geometry = new THREE.SphereBufferGeometry(0.06, 32, 32);
      let material = selected ? new THREE.MeshBasicMaterial({color: 0xe2a149}): new THREE.MeshBasicMaterial({color: 'white'});

      let mesh = new THREE.Mesh(geometry, material);

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.x = x;
      mesh.position.y = 0;
      mesh.position.z = z;

      return mesh;
  });
}

function getLineModels ({lines, points}) {
  return _.map(lines, ({from, to}) => {

      let geometry = new LineGeometry();
      let material = new LineMaterial({color: 0xffffff, linewidth: 0.008, transparent: true, opacity: 0.9});

      geometry.setPositions([points[from].x, 0, points[from].z, points[to].x, 0, points[to].z]);

      return new Line2(geometry, material);
  });
}

function getColumnsModels (points, skirting=false){
  return _.map(points, ({x, z})=> {

      let height = skirting? HEIGHT/20 : HEIGHT;
      let depth = skirting? 1.2 * DEPTH : DEPTH;

      let geometry = new THREE.CylinderGeometry(depth/2, depth/2, height, 32);
      let material = skirting? skirtingMaterial : new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true, opacity: 1});

      let mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(x, height/2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      return mesh;
  });
}

function getWallsModels ({lines, points}, skirting=false) {
  return _.map(lines, ({from, to}) => {

    let startPoint = points[from];
    let endPoint = points[to];
    let width = Math.hypot(startPoint.x - endPoint.x, startPoint.z - endPoint.z);

    let height = skirting? HEIGHT/20 : HEIGHT;
    let depth = skirting? 1.2 * DEPTH : DEPTH;

    let geometry = new THREE.BoxGeometry(width, height, depth);
    let material = skirting? skirtingMaterial : new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true, opacity: 1});

    let mesh = new THREE.Mesh(geometry, material);

    let offsetX = startPoint.x - endPoint.x;
    let offsetZ = startPoint.z - endPoint.z;
    let angle = -Math.atan(offsetZ / offsetX);

    mesh.position.set(endPoint.x + offsetX / 2, height / 2, endPoint.z + offsetZ / 2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.rotateY(angle);

    return mesh;
  });
}

export function createFloorModel() {

    let graph = new Graph();
    let points = floorPlan.points;
    let lines = floorPlan.lines;

    _.each(points, (point) => graph.addVertex(points.indexOf(point), {value: 1}));
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
            if (cycles[j].every(val => cycles[i].includes(val))) {
                contained = true;
                break;
            }
        }
        if (!contained) {
            rooms.push(cycles[i]);
        }
    }

    let floor = new THREE.Group();
    let centers = [];
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

            let mesh = new THREE.Mesh( geometry, floorMaterial );

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



