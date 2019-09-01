import {MDCDrawer} from "@material/drawer/component";
import {MDCIconButtonToggle} from "@material/icon-button/component";
import {MDCRipple} from "@material/ripple/component";

import {toggleView} from "./src/view";
import {deleteDrawing, editDrawing} from "./src/draw";
import {app} from "./src/app";

export let drawer, buttons, viewButton, editButton, deleteButton;


export function createButtons(){

    let drawerEl = document.getElementById('drawer');
    drawer = new MDCDrawer.attachTo(drawerEl);

    buttons = document.getElementById('buttons');

    viewButton = createIconButton('dashboard', 'layers');
    buttons.appendChild(viewButton);
    viewButton.addEventListener('click', toggleView);

    let iconToggle = new MDCIconButtonToggle(document.getElementsByClassName('mdc-icon-button')[0]);
    iconToggle.unbounded = true;

    editButton = createIconButton( 'edit');
    editButton.addEventListener('click', function (){
        app.addEventListener( 'click', editDrawing, false);
        app.removeEventListener( 'click', deleteDrawing, false);
    });

    let editRipple = new MDCRipple(document.getElementById('edit'));
    editRipple.unbounded = true;

    deleteButton = createIconButton('delete');
    deleteButton.addEventListener('click', function (){
        app.addEventListener( 'click', deleteDrawing, false);
        app.removeEventListener( 'click', editDrawing, false);
    });

    let deleteRipple = new MDCRipple(document.getElementById('delete'));
    deleteRipple.unbounded = true;
}

export function viewButtons(){

}

export function modelButtons(){

}

function createIconButton(name, nameOn){

    let button = document.createElement('button');
    button.className = 'mdc-button mdc-icon-button';
    button.id = name;
    let icon = document.createElement('i');
    icon.className = 'material-icons mdc-icon-button__icon';
    icon.innerText = name;
    icon.title = name;
    button.appendChild(icon);
    buttons.appendChild(button);

    if(nameOn){
        let iconOn = document.createElement('i');
        iconOn.className = 'material-icons mdc-icon-button__icon mdc-icon-button__icon--on';
        iconOn.innerText = nameOn;
        iconOn.title = nameOn;
        button.appendChild(iconOn);
    }

    return button
}

