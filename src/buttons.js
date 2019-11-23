import {MDCRipple} from "@material/ripple/component";

import {toggleView} from "./view";
import {deleteDrawing, editDrawing} from "./draw";
import {canvas} from "./app";
import {exportScene} from "./loader";


export let drawButtons, modelButtons, viewButton, firstIcon, secondIcon, downloadButton, editButton, deleteButton;
export let currentMode;

export function createButtons(){

    viewButton = document.getElementById('view-button');
    firstIcon = document.getElementById('first-icon');
    secondIcon = document.getElementById('second-icon');

    drawButtons = document.getElementById('draw-buttons');
    drawButtons.style.display = 'none';

    deleteButton = createIconButton('delete', drawButtons);
    editButton = createIconButton( 'edit', drawButtons);

    hideButton(deleteButton);
    hideButton(editButton);

    modelButtons = document.getElementById('model-buttons');
    downloadButton = createIconButton( 'save', modelButtons);

    hideButton(downloadButton);

    activateModelButtons();

}


function createIconButton(name, buttons){

    let button = document.createElement('button');
    button.className = 'mdc-fab mdc-fab--mini';
    button.id = name;

    button.onmouseover = () => {
        button.style.transform = 'translateY(3%)';
    };
    button.onmouseout = () => {
        button.style.transform = 'translateY(-3%)';
    };

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
    activateModelButtons();

    viewButton.addEventListener('click', viewMode, false);
    viewButton.addEventListener('click', toggleView, false);
}


export function deactivateButtons(){

    deactivateDrawButtons();
    deactivateModelButtons();

    viewButton.removeEventListener('click', viewMode, false);
    viewButton.removeEventListener('click', toggleView, false);
}


export function activateDrawButtons(){
    editButton.addEventListener('click', editMode, false);
    deleteButton.addEventListener('click', deleteMode, false);
}


export function activateModelButtons(){
    downloadButton.addEventListener('click', viewMode, false);
    downloadButton.addEventListener('click', exportScene, false);
}


export function deactivateDrawButtons(){

    editButton.removeEventListener('click', editMode, false);
    deleteButton.removeEventListener('click', deleteMode, false);
}


export function deactivateModelButtons(){

    downloadButton.removeEventListener('click', viewMode, false);
    downloadButton.removeEventListener('click', exportScene, false);
}

export function viewMode(){
    canvas.removeEventListener( 'click', editDrawing, false);
    canvas.removeEventListener( 'click', deleteDrawing, false);
}

export function editMode(){
    currentMode = "edit";
    canvas.addEventListener( 'click', editDrawing, false);
    canvas.removeEventListener( 'click', deleteDrawing, false);
}


export function deleteMode(){
    currentMode = "delete";
    canvas.addEventListener( 'click', deleteDrawing, false);
    canvas.removeEventListener( 'click', editDrawing, false);
}



export function showDrawButtons(){

    drawButtons.style.display = 'flex';

    setTimeout(() => {
        showButton(editButton);
    }, 100);

    setTimeout(() => {
        showButton(deleteButton);
    }, 200);
}


export function hideDrawButtons(){
    hideButton(deleteButton);

    setTimeout(() => {
        hideButton(editButton);
    }, 100);

    setTimeout( () => {
        drawButtons.style.display = 'none';
    }, 200);

}


export function showModelButtons(){
    modelButtons.style.display = 'flex';

    setTimeout( () => {
        showButton(downloadButton);
    }, 100);

}


export function hideModelButtons(){
    hideButton(downloadButton);

    setTimeout( () => {
        modelButtons.style.display = 'none';
    }, 100);
}


export function showDrawIcon(){
    hideButton(firstIcon);
    setTimeout( () => {
        firstIcon.style.display = 'none';
        secondIcon.style.display = 'block';
        showButton(secondIcon);
    }, 100);

}


export function showModelIcon(){
    hideButton(secondIcon);
    setTimeout( () => {
        secondIcon.style.display = 'none';
        firstIcon.style.display = 'block';
        showButton(firstIcon);
    }, 100);
}


export function hideButton(element){
    element.style.transform = 'scale(0)';
}


export function showButton(element){
    element.style.transform = 'scale(1)';
}


