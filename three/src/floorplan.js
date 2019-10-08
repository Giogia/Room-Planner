'use strict';

import _ from 'lodash';
import * as THREE from 'three';
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Line2 } from "three/examples/jsm/lines/Line2";

import earcut from 'earcut';

import {floorPlan} from "./draw";


const DEPTH = 0.1;
const HEIGHT = 1.3;

const MATERIAL = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.75});


export function createModel () {

  let points = getPointModels(floorPlan.points);
  let lines = getLineModels(floorPlan);

  let group = new THREE.Group();

  _.each(points, (point) => group.add(point));
  _.each(lines, (line) => group.add(line));

  return group;
}

export function createWallsModel () {

  let columns = getColumnsModels(floorPlan.points);
  let walls = getWallsModels(floorPlan);

  let group = new THREE.Group();

  _.each(walls, (wall) => group.add(wall));
  _.each(columns, (column) => group.add(column));

  //drawFloor();
  //group.add(floor);


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
      color: 'white',
      linewidth: 0.008,
    });

    let geometry = new LineGeometry();
    geometry.setPositions([points[from].x, 0, points[from].z, points[to].x, 0, points[to].z]);

    return new Line2(geometry, material);
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


function drawFloor() {

  for(let point of floorPlan.points){

    let lines = _.filter(floorPlan.lines, { from: point.id });

    //let face = [firstLine.from, firstLine.to];

    console.log(lines);



    //let seconLine = _.find(floorPlan.lines, {from: firstLine.to});

    //face.push(seconLine.to);
    //console.log(seconLine);

  }
  /*
  let vertices = [];

  _.each(floorPlan.points, (point) => vertices.push([point.x,point.z]));
  console.log("vertices", vertices);

  let data = [];

   _.each(vertices, (point) => data.push(point[0], point[1]));

  console.log("data", data);

  let triangles = earcut(data);

  console.log('hull', triangles);

  let geometry = new THREE.Geometry();

  _.each(vertices, (point) => geometry.vertices.push(new THREE.Vector3(point[0],0, point[1])));

  for( let i=0; i<triangles.length; i+=3){

      let sorted = [triangles[i], triangles[i+1], triangles[i+2]].sort();
      console.log('sorted', sorted);
      geometry.faces.push(new THREE.Face3(sorted[i], sorted[i+1], sorted[i+2]));
  }

  console.log('faces', geometry.faces);

  //_.each(triangles, (triangle) => geometry.faces.push(new THREE.Face3(triangle[0],triangle[1],triangle[2])));

  //let texture = new THREE.TextureLoader().load( './assets/wooden2.jpg' );

  let material = new THREE.MeshLambertMaterial( { color: 0xd6b68b } );

  return new THREE.Mesh( geometry, material );

   */
}
