'use strict';

import '@google/model-viewer';
import { objectsList } from "./objectsList";

let ul;

let list = document.getElementById('objects');


function createList(){

    ul = document.createElement('ul');

    for (let object of objectsList){

        let li = document.createElement('li');
        ul.appendChild(li);

        let model = document.createElement('model-viewer');
        model.src = './models/gltf/' + object + '.glb';
        model.alt = object;
        model.autoRotate= true;
        model.cameraControl= true;
        li.appendChild(model);
    }
    list.appendChild(ul);
}

createList();

