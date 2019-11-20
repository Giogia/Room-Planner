import {MDCRipple} from "@material/ripple/component";

import {toggleView} from "./view";
import {deleteDrawing, editDrawing} from "./draw";
import {canvas} from "./app";
import {exportScene} from "./loader";


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
    button.className = 'mdc-fab';
    button.id = name;
    buttons.appendChild(button);

    let icon = document.createElement('a');
    icon.className = 'material-icons mdc-fab__icon';
    icon.innerText = name;
    button.appendChild(icon);

    let toggle = new MDCRipple(button);

    return button
}


export function activateButtons(){

    activateDrawButtons();

    downloadButton.addEventListener('click', viewMode, false);
    downloadButton.addEventListener('click', exportScene, false);

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
    downloadButton.removeEventListener('click', exportScene, false);

    viewButton.removeEventListener('click', viewMode, false);
    viewButton.removeEventListener('click', toggleView, false);
}


export function viewMode(){
    canvas.removeEventListener( 'click', editDrawing, false);
    canvas.removeEventListener( 'click', deleteDrawing, false);
}

export function editMode(){
    canvas.addEventListener( 'click', editDrawing, false);
    canvas.removeEventListener( 'click', deleteDrawing, false);
}


function deleteMode(){
    canvas.addEventListener( 'click', deleteDrawing, false);
    canvas.removeEventListener( 'click', editDrawing, false);
}


export function hideButton(element, translation=150, timeout=150){
    element.style.transform = 'translateY('+ translation.toString() +'%)';

    setTimeout(function(){
        element.style.opacity = '0';
    }, timeout);
}


export function showButton(element, translation=150){
    element.style.opacity = '100';
    element.style.transform = 'translateY('+ translation.toString() +'%)';

}


export function modelButtons(){
    hideButton(deleteButton, 300);
    hideButton(editButton, 150);
    setTimeout(function(){
        showButton(downloadButton, 0);
    }, 250);
}


export function drawButtons(){
    hideButton(downloadButton, 150);
    setTimeout( function(){
        showButton(deleteButton, 150);
        showButton(editButton, 150);
    }, 250);
}
