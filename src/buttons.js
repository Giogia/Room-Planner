import {MDCRipple} from "@material/ripple/component";

import {toggleView} from "./view";
import {deleteDrawing, editDrawing} from "./draw";
import {canvas} from "./app";
import {exportScene} from "./loader";
import {removeObject} from "./objects";


export let drawButtons, modelButtons, viewButton, firstIcon, secondIcon, downloadButton, editButton, deleteButton, removeButton;
export let currentMode;

export function createButtons(){

    viewButton = document.getElementById('view-button');

    viewButton.onmouseover = () => {
        viewButton.style.transform = 'translateY(3%)';
    };
    viewButton.onmouseout = () => {
        viewButton.style.transform = 'translateY(-3%)';
    };

    firstIcon = document.getElementById('first-icon');
    secondIcon = document.getElementById('second-icon');

    drawButtons = document.getElementById('draw-buttons');
    drawButtons.style.display = 'none';

    deleteButton = createIconButton('clear', drawButtons);
    editButton = createIconButton( 'create', drawButtons);

    hideButton(deleteButton);
    hideButton(editButton);

    modelButtons = document.getElementById('model-buttons');

    removeButton = createIconButton('delete_forever', modelButtons);
    removeButton.style.color = 'red';
    downloadButton = createIconButton( 'save', modelButtons);

    hideButton(removeButton);
    hideButton(downloadButton);

    activateModelButtons();

}


function createIconButton(name, buttons){

    let button = document.createElement('button');
    button.className = 'mdc-fab mdc-fab--mini';
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
    canvas.removeEventListener('click', removeObject, false);
    canvas.removeEventListener( 'click', editDrawing, false);
    canvas.removeEventListener( 'click', deleteDrawing, false);
}

export function editMode(){
    currentMode = "edit";
    canvas.addEventListener( 'click', editDrawing, false);
    canvas.removeEventListener( 'click', deleteDrawing, false);
    canvas.removeEventListener('click', removeObject, false);
}


export function deleteMode(){
    currentMode = "delete";
    canvas.addEventListener( 'click', deleteDrawing, false);
    canvas.removeEventListener( 'click', editDrawing, false);
    canvas.removeEventListener('click', removeObject, false);
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
    element.onmouseover = null;
    element.onmouseout = null;
}


export function showButton(element){
    element.style.transform = 'scale(1)';

    element.onmouseover = () => {
        element.style.transform = 'translateY(3%)';
    };
    element.onmouseout = () => {
            element.style.transform = 'translateY(-3%)';
    };
}


