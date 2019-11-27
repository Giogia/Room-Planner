import * as THREE from "three";

export let textureLoader = new THREE.TextureLoader();
export let fontLoader = new THREE.FontLoader();

// Material for Room Floors
export let floorMaterial = new THREE.MeshStandardMaterial( {
    roughness: 2,
    color: 0xffffff,
    metalness: 0.2,
    bumpScale: 3,
    polygonOffset: true,
    polygonOffsetFactor: -1
} );

let choice = 2;
let repeat = 1.2;

let diffuseMap = textureLoader.load( "assets/materials/tiles"+choice.toString()+"_diffuse.jpg");
let bumpMap = textureLoader.load( "assets/materials/tiles"+choice.toString()+"_bump.jpg");
let roughnessMap = textureLoader.load( "assets/materials/tiles"+choice.toString()+"_roughness.jpg");

for(let map of [diffuseMap, bumpMap, roughnessMap]){
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(repeat, repeat);
}

floorMaterial.map = diffuseMap;
floorMaterial.bumpMap = bumpMap;
floorMaterial.roughnessMap = roughnessMap;
floorMaterial.needsUpdate = true;

// Material for Skirting
export let skirtingMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.05,
    color: 0xffffff,
    bumpScale: 0.05,
    metalness: 0.02,
    transparent: true,
    opacity: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1
});

let skirtingMap = textureLoader.load( "assets/materials/wood_diffuse.jpg");
skirtingMap.wrapS = THREE.RepeatWrapping;
skirtingMap.wrapT = THREE.RepeatWrapping;
skirtingMap.anisotropy = 4;
skirtingMap.repeat.set( 1, 1.3);

skirtingMaterial.map = skirtingMap;
skirtingMaterial.needsUpdate = true;

// Material for Text
export let textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

export let font;

fontLoader.load( 'assets/font.typeface.json', res => {
    font = res;
});

// Material for selected Items
export let selectedMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5});

