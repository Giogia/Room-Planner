'use strict';
import '@google/model-viewer';
import { objectsList } from "./objectsList";

let ul;

let list = document.getElementById('list');
let search = document.getElementById('search-icon');

function createList(){

    getList();
    list.appendChild(ul);
}

function updateList(){

    let search = document.getElementById('search-input').value;
    let found = false;

    list.removeChild(ul);

    getList(search.toLowerCase());

    list.appendChild(ul);

    if(found === false){
        let message = document.createElement('div');
        message.className = "mdc-typography";
        message.innerText = "No results found";
        message.id = 'search-message';
        ul.appendChild(message);
    }

}

function getList(word){

    ul = document.createElement('ul');

    console.log(word);

    for (let object of objectsList){

        if(word === undefined || object.includes(word)){

            let li = document.createElement('li');
            ul.appendChild(li);

            let model = document.createElement('model-viewer');
            model.className = "mdc-elevation__z24";
            model.src = './models/gltf/' + object + '.glb';
            model.id = object;
            li.appendChild(model);
        }
    }
}

createList();
search.addEventListener('click', updateList, false);
