'use strict';

import _ from 'lodash';
import * as THREE from 'three';
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";

const DEPTH = 0.1;
const HEIGHT = 1.5;

const MATERIAL = new THREE.MeshLambertMaterial({color: 0xffc6c3, transparent: true, opacity: 0.6});

export function createModel (floorplan) {

  let points = getPointModels(floorplan.points);
  let lines = getLineModels(floorplan);

  let group = new THREE.Group();

  _.each(points, (point) => group.add(point));
  _.each(lines, (line) => group.add(line));

  return group;
}

export function createWallsModel ( floorplan) {

  let walls = getWallsModels(floorplan);
  let columns = getColumnsModels(floorplan.points);
  let floor = drawFloor([floorplan.points[0], floorplan.points[1], floorplan.points[2], floorplan.points[3]]);
  let floor2 = drawFloor([floorplan.points[2], floorplan.points[4], floorplan.points[9], floorplan.points[11]]);

  let group = new THREE.Group();

  _.each(walls, (wall) => group.add(wall));
  _.each(columns, (column) => group.add(column));

  group.add(floor);
  group.add(floor2);

  return group;
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


function getPointModels (points) {
  return _.map(points, ({x, z}, id) => {
    let geometry = new THREE.SphereBufferGeometry(0.02, 32, 32);
    let material = new THREE.MeshPhongMaterial({color: 'white'});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.x = x;
    mesh.position.z = z;
    mesh.data = {id};

    return mesh;
  });
}

function getWallsModels ({lines, points}) {
  return _.map(lines, ({from, to}) => {

    let startPoint = points[from];
    let endPoint = points[to];

    let width = Math.hypot(startPoint.x - endPoint.x, startPoint.z - endPoint.z);

    //let material = new THREE.MeshPhongMaterial({color: 'white'});

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

function getColumnsModels (points){
  return _.map(points, ({x, z})=> {

    //let material = new THREE.MeshPhongMaterial({color: 'white'});

    let columnGeometry = new THREE.CylinderGeometry(DEPTH/2, DEPTH/2, HEIGHT, 32);
    let columnMesh = new THREE.Mesh(columnGeometry, MATERIAL);

    columnMesh.position.set(x, HEIGHT/2, z);
    columnMesh.castShadow = true;
    columnMesh.receiveShadow = true;

    return columnMesh;
  });
}

function drawFloor(points) {

  let vertices = [];

  _.each(points, (point) => vertices.push(new THREE.Vector3(point.x,0,point.z)));

  let geometry = new ConvexGeometry( vertices );

  let material = new THREE.MeshPhongMaterial( {
    color: 'white',
    flatShading: true,
  } );

  return new THREE.Mesh( geometry, material );
}