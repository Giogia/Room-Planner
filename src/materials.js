import * as THREE from "three";

export let textureLoader = new THREE.TextureLoader();
export let fontLoader = new THREE.FontLoader();
export let font;

function setMaps(maps, repeat){

   for(let map of maps){
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(repeat[0], repeat[1]);
    }
}

function setTexture(name, material, repeat){

    let maps = [];

    let diffuseMap = textureLoader.load( "assets/materials/"+name.toString()+"_diffuse.jpg");
    let bumpMap = textureLoader.load( "assets/materials/"+name.toString()+"_bump.jpg");
    let roughnessMap = textureLoader.load( "assets/materials/"+name.toString()+"_roughness.jpg");

    if(diffuseMap !== null){ maps.push(diffuseMap)}
    if(bumpMap !== null){ maps.push(bumpMap)}
    if(roughnessMap !== null){ maps.push(roughnessMap)}

    setMaps(maps, repeat);

    material.map = diffuseMap;
    material.bumpMap = bumpMap;
    material.roughnessMap = roughnessMap;
    material.needsUpdate = true;
}

function setFont(name){
    fontLoader.load( 'assets/'+name+'.typeface.json', res => {
        font = res;
    });
}


// Material for Room Floors
export let floorMaterial = new THREE.MeshStandardMaterial( {
    roughness: 0.8,
    color: 0xffffff,
    bumpScale: 0.0005,
    metalness: 0.2,
    polygonOffset: true,
    polygonOffsetFactor: -1
});
setTexture('wood', floorMaterial, [0.5, 1.2]);


// Material for Skirting
export let skirtingMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    color: 0xffffff,
    bumpScale: 0.0005,
    metalness: 0.2,
    transparent: true,
    opacity: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1
});
setTexture('skirting', skirtingMaterial, [1, 1.3]);


// Material for Text
export let textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
setFont('font');


// Material for selected Items
export let selectedMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
});




