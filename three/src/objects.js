'use strict';

import * as THREE from 'three';
import GLTFLoader from "three-gltf-loader";

// create plane
var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
    color: 0x999999,
    depthWrite: false
}));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
grid.receiveShadow = true;
scene.add(grid);

var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

var model;

var loader = new GLTFLoader();
loader.load('./models/gltf/wall.glb', function (gltf) {

    model = gltf.scene;
    //model.position.set( 1, 1, 0 );


    scene.add(model);

}, undefined, function (error) {

    console.error(error);

});




var geometry = new THREE.BoxBufferGeometry( 0.4, 0.4, 0.4 );
for ( var i = 0; i < 20; i ++ ) {
    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    object.position.x = Math.random() * 10 - 5;
    object.position.y = 0;
    object.position.z = Math.random() * 8 - 4;
    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;
    object.scale.x = Math.random() * 2 + 1;
    object.scale.y = Math.random() * 2 + 1;
    object.scale.z = Math.random() * 2 + 1;
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add( object );
    objects.push( object );
}