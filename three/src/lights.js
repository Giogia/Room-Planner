'use strict';

import * as THREE from 'three';
import { scene } from './app';

export let hemisphere, ambient, directional, spot

export function addLights(){

    hemisphere = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemisphere.intensity = 0.6;
    hemisphere.position.set(0, 20, 0);

    ambient = new THREE.AmbientLight(0xffffff, 0.1);

    directional = new THREE.DirectionalLight(0xffffff);
    directional.position.set(0, 20, 10);


    spot = new THREE.SpotLight(0xffffff, 1.0);
    spot.angle = 1;
    spot.penumbra = 1;
    spot.position.set(-250, 200, 250);
    spot.shadow.mapSize.height = spot.shadow.mapSize.width = 4096;
    spot.castShadow = true;
    spot.shadow.camera.far = 1000;

    scene.add(hemisphere);
    scene.add(spot);

    // helper template
    //CAMERA.shadowCameraHelper = new THREE.CameraHelper(CAMERA.shadow.camera);
    //scene.add(CAMERA.shadowCameraHelper);
}
