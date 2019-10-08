'use strict';
import '@google/model-viewer';
import { objectsList } from "./objectsList";

let ul;

let list = document.getElementById('list');
let form = document.getElementById('search-form');
let search = document.getElementById('search-icon');

function createList(){

    getList();
    list.appendChild(ul);
}

function updateList(event){

    event.preventDefault();

    let search = document.getElementById('search-input').value;

    list.removeChild(ul);

    let found = getList(search.toLowerCase());

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

    let found = false;

    for (let object of objectsList){

        if(word === undefined || object.includes(word)){

            found = true;

            let li = document.createElement('li');
            ul.appendChild(li);

            let model = document.createElement('model-viewer');
            model.className = "mdc-elevation__z24";
            model.src = './models/gltf/' + object + '.glb';
            model.id = object;
            li.appendChild(model);
        }
    }

    return found
}

createList();

form.onsubmit = updateList;
search.addEventListener('click', updateList, false);