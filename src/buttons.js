import {MDCRipple} from "@material/ripple/component";

import {toggleView} from "./view";
import {deleteDrawing, editDrawing} from "./draw";
import {canvas} from "./app";
import {saveScene} from "./loader";


export let buttons, viewButton, downloadButton, editButton, deleteButton;


export function createButtons(){

    buttons = document.getElementById('buttons');

    deleteButton = createIconButton('delete');
    editButton = createIconButton( 'edit');
    downloadButton = createIconButton( 'save');
    viewButton = createIconButton('layers');

    hideButton(deleteButton, 300, 0);
    hideButton(editButton, 150, 0);

    activateButtons();

}


function createIconButton(name){

    let button = document.createElement('button');
    button.className = 'mdc-fab mdc-elevation__z24';
    button.id = name;
    buttons.appendChild(button);

    let icon = document.createElement('span');
    icon.className = 'material-icons mdc-fab__icon';
    icon.innerText = name;
    button.appendChild(icon);

    let toggle = new MDCRipple(button);

    return button
}


export function activateButtons(){

    activateDrawButtons();

    downloadButton.addEventListener('click', viewMode, false);
    downloadButton.addEventListener('click', saveScene, false);

    viewButton.addEventListener('click', viewMode, false);
    viewButton.addEventListener('click', toggleView, false);
}


export function activateDrawButtons(){

    editButton.addEventListener('click', editMode, false);
    deleteButton.addEventListener('click', deleteMode, false);
}

export function deactivateDrawButtons(){

    editButton.removeEventListener('click', editMode, false);
    deleteButton.removeEventListener('click', deleteMode, false);
}


export function deactivateButtons(){

    deactivateDrawButtons();

    downloadButton.removeEventListener('click', viewMode, false);
    downloadButton.removeEventListener('click', saveScene, false);

    viewButton.removeEventListener('click', viewMode, false);
    viewButton.removeEventListener('click', toggleView, false);
}


function viewMode(){
    canvas.removeEventListener( 'click', editDrawing, false);
    canvas.removeEventListener( 'click', deleteDrawing, false);
}

function editMode(){
    canvas.addEventListener( 'click', editDrawing, false);
    canvas.removeEventListener( 'click', deleteDrawing, false);
}


function deleteMode(){
    canvas.addEventListener( 'click', deleteDrawing, false);
    canvas.removeEventListener( 'click', editDrawing, false);
}


export function hideButton(element, translation=97, timeout=250){
    element.style.transform = 'translateY('+ translation.toString() +'%)';

    setTimeout(function(){
        element.style.opacity = '0';
    }, timeout);
}


export function showButton(element, translation=97){
    element.style.opacity = '100';
    element.style.transform = 'translateY(-'+ translation.toString() +'%)';

}
