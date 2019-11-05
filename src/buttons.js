import {MDCRipple} from "@material/ripple/component";

import {hideElement, toggleView} from "./view";
import {deleteDrawing, editDrawing} from "./draw";
import {canvas} from "./app";
import {saveScene} from "./loader";


export let buttons, viewButton, downloadButton, editButton, deleteButton;


export function createButtons(){

    buttons = document.getElementById('buttons');

    deleteButton = createIconButton('delete');
    deleteButton.addEventListener('click', function (){
        canvas.addEventListener( 'click', deleteDrawing, false);
        canvas.removeEventListener( 'click', editDrawing, false);
    });
    hideElement(deleteButton, 300, 0);

    editButton = createIconButton( 'edit');
    editButton.addEventListener('click', function (){
        canvas.addEventListener( 'click', editDrawing, false);
        canvas.removeEventListener( 'click', deleteDrawing, false);
    });
    hideElement(editButton, 150, 0);

    downloadButton = createIconButton( 'save');
    downloadButton.addEventListener('click', function (){
        canvas.removeEventListener( 'click', editDrawing, false);
        canvas.removeEventListener( 'click', deleteDrawing, false);
    });
    downloadButton.addEventListener('click', saveScene, false);

    viewButton = createIconButton('layers');
    buttons.appendChild(viewButton);
    viewButton.addEventListener('click', toggleView, false);
}


function createIconButton(name){

    let button = document.createElement('button');
    button.className = 'mdc-fab';
    button.id = name;
    buttons.appendChild(button);

    let icon = document.createElement('i');
    icon.className = 'material-icons mdc-fab__icon';
    icon.innerText = name;
    button.appendChild(icon);

    let toggle = new MDCRipple(button);

    return button
}

