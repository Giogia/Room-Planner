'use strict';

import '@google/model-viewer';
import { objectlist } from "./config";
import {addObject} from "./objects";


let ul;

let list = document.getElementById('objects');

createList();

document.addEventListener('click', click, false);

function createList(){

    ul = document.createElement('ul');

    for (let object of objectlist){

        let li = document.createElement('li');
        ul.appendChild(li);

        let model = document.createElement('model-viewer');
        let path  = './models/gltf/' + object + '.glb';
        model.src = path;
        model.alt = object;
        model.cameraControls= true;
        model.autoRotate= true;
        li.appendChild(model);
    }
    list.appendChild(ul);
}


function click(event){

    addObject(event.target.alt);
}
