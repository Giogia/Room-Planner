import {MDCDrawer} from "@material/drawer/component";
import {MDCIconButtonToggle} from "@material/icon-button/component";

import {toggleView} from "./src/view";
import {deleteDrawing, editDrawing} from "./src/draw";
import {app} from "./src/app";

export let drawer, buttons, viewButton, editButton, deleteButton;


export function createButtons(){

    let drawerEl = document.getElementById('drawer');
    drawer = new MDCDrawer.attachTo(drawerEl);

    buttons = document.getElementById('buttons');

    viewButton = createIconButton('dashboard');
    addOnIcon(viewButton, 'layers');

    buttons.appendChild(viewButton);
    viewButton.addEventListener('click', toggleView);

    const iconToggle = new MDCIconButtonToggle(document.getElementById('dashboard'));
    iconToggle.unbounded = true;

    editButton = createIconButton( 'edit');
    editButton.addEventListener('click', function (){
        app.addEventListener( 'click', editDrawing, false);
        app.removeEventListener( 'click', deleteDrawing, false);
    });

    deleteButton = createIconButton('delete');
    deleteButton.addEventListener('click', function (){
        app.addEventListener( 'click', deleteDrawing, false);
        app.removeEventListener( 'click', editDrawing, false);
    });
}

export function viewButtons(){

}

export function modelButtons(){

}

function createIconButton(name){

    let button = document.createElement('button');
    button.className = 'mdc-button mdc-icon-button';
    button.id = name;
    let icon = document.createElement('i');
    icon.className = 'material-icons mdc-icon-button__icon';
    icon.innerText = name;
    icon.title = name;
    icon.ariaHidden = true;
    icon.ariaLabel = name;
    button.appendChild(icon);
    buttons.appendChild(button);

    return button
}

function addOnIcon(button, name){

    let icon = document.createElement('i');
    icon.className = 'material-icons mdc-icon-button__icon mdc-icon-button__icon--on';
    icon.innerText = name;
    icon.title = name;
    icon.ariaHidden = true;
    icon.ariaLabel = name;
    button.appendChild(icon);
}

