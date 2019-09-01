'use strict';

import '@google/model-viewer';
import { objectsList } from "./objectsList";

let ul;

let list = document.getElementById('objects');
let search = document.getElementById('search-icon');

let found;

function createList(){

    ul = document.createElement('ul');

    filterList('');

    list.appendChild(ul);
}

function filterList(word){

    for (let object of objectsList){

        if(object.includes(word)){

            found = true;

            let li = document.createElement('li');
            ul.appendChild(li);

            let model = document.createElement('model-viewer');
            model.src = './models/gltf/' + object + '.glb';
            model.alt = object;
            model.id = object;
            model.autoRotate = true;
            model.className = "mdc-elevation--z24";
            li.appendChild(model);
        }
    }
}

function updateList(){

    let search = document.getElementById('search-input').value;
    console.log(name);

    list.removeChild(ul);

    ul = document.createElement('ul');

    found = false;

    filterList(search);

    list.appendChild(ul);

    if(!found){
        let message = document.createElement('div');
        message.className = "mdc-typography";
        message.innerText = "No results found";
        message.id = 'search-message';
        ul.appendChild(message);
    }

}

createList();
search.addEventListener('click', updateList, false);