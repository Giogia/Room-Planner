import {MDCRipple} from "@material/ripple/component";

import {toggleView} from "./view";
import {deleteDrawing, editDrawing} from "./draw";
import {canvas} from "./app";


export let buttons, viewButton, editButton, deleteButton;


export function createButtons(){

    buttons = document.getElementById('buttons');

    deleteButton = createIconButton('delete');
    deleteButton.addEventListener('click', function (){
        canvas.addEventListener( 'click', deleteDrawing, false);
        canvas.removeEventListener( 'click', editDrawing, false);
    });
    deleteButton.style.display = "none";

    editButton = createIconButton( 'edit');
    editButton.addEventListener('click', function (){
        canvas.addEventListener( 'click', editDrawing, false);
        canvas.removeEventListener( 'click', deleteDrawing, false);
    });
    editButton.style.display = "none";


    viewButton = createIconButton('layers');
    buttons.appendChild(viewButton);
    viewButton.addEventListener('click', toggleView);
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
    //toggle.unbounded = true;

    return button
}

