'use strict';

import * as THREE from 'three';
import { scene } from './app';

export function addLights(){

    let hemisphere = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemisphere.position.set(0, 200, 0);

    let directional = new THREE.DirectionalLight(0xffffff);
    directional.position.set(0, 20, 10);

    let ambient = new THREE.AmbientLight(0xFFFFFF, 0.20);

    let spot = new THREE.SpotLight(0xFFFFFF, 1.5);
    spot.angle = 1;
    spot.penumbra = 1;
    spot.position.set(-250, 200, 250);
    spot.shadow.mapSize.height = spot.shadow.mapSize.width = 4096;
    spot.castShadow = true;
    spot.shadow.camera.far = 1000;

    //scene.add(hemisphere);
    //scene.add(directional);
    scene.add(ambient);
    scene.add(spot);

    // helper template
    //CAMERA.shadowCameraHelper = new THREE.CameraHelper(CAMERA.shadow.camera);
    //scene.add(CAMERA.shadowCameraHelper);
}
