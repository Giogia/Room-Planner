import * as THREE from "three";

export let textureLoader = new THREE.TextureLoader();

export let floorMaterial = new THREE.MeshStandardMaterial( {
    roughness: 1,
    color: 0xffffff,
    metalness: 0.02,
    bumpScale: 5
} );

let choice = 3;

textureLoader.load( "assets/materials/tiles"+choice.toString()+"_diffuse.jpg", function ( map ) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(2,2);
    floorMaterial.map = map;
    floorMaterial.needsUpdate = true;
});
textureLoader.load( "assets/materials/tiles"+choice.toString()+"_bump.jpg", function ( map ) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(2, 2);
    floorMaterial.bumpMap = map;
    floorMaterial.needsUpdate = true;
});
textureLoader.load( "assets/materials/tiles"+choice.toString()+"_roughness.jpg", function ( map ) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(2, 2);
    floorMaterial.roughnessMap = map;
    floorMaterial.needsUpdate = true;
});

floorMaterial.polygonOffset = true;
floorMaterial.polygonOffsetFactor = -1;


export let skirtingMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.05,
    color: 0xffffff,
    bumpScale: 0.05,
    metalness: 0.02,
    transparent: true,
    opacity: 1,
});

skirtingMaterial.polygonOffset = true;
skirtingMaterial.polygonOffsetFactor = -1;