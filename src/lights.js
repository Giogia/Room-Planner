'use strict';

import * as THREE from 'three';
import { scene } from './app';

export let hemisphere, ambient, directional, spot;


export function addLights(){

    hemisphere = new THREE.HemisphereLight(0xffffff, 0x444444, 1 );
    hemisphere.position.set(0, 20, 0);
    scene.add( hemisphere );

    directional = new THREE.DirectionalLight( 0xffffff );
    directional.position.set( 6, 20, - 6 );
    directional.castShadow = true;
    directional.shadow.camera.top = 10;
    directional.shadow.camera.bottom = - 10;
    directional.shadow.camera.left = - 10;
    directional.shadow.camera.right = 10;
    directional.shadow.camera.near = 0.1;
    directional.shadow.camera.far = 40;
    scene.add( directional );
}