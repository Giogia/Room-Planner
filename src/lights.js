'use strict';

import * as THREE from 'three';
import { scene } from './app';

export let hemisphere, ambient, directional, spot;

export function addLights(){

    hemisphere = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.6 );
    hemisphere.position.set(0, 20, 0);
    scene.add( hemisphere );

    createSpot(-250, 200, 250);
    createSpot(250, 200, 250);
    createSpot(250, 200, -250);

    scene.add(spot);
}

function createSpot(x,y,z){
    spot = new THREE.SpotLight(0xfff5e1, 0.3);
    spot.angle = 1;
    spot.penumbra = 1;
    spot.position.set(x, y, z);
    spot.shadow.mapSize.height = spot.shadow.mapSize.width = 4096;
    spot.castShadow = true;
    spot.shadow.camera.far = 1000;
    scene.add(spot);
}