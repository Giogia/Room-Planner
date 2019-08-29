import {toggleView} from "./src/view";
import {MDCDrawer} from "@material/drawer/component";
import {deleteDrawing, editDrawing} from "./src/draw";
import {app} from "./src/app";

export let drawer, buttons, viewButton, editButton, deleteButton;


export function createButtons(){

    let drawerEl = document.getElementById('drawer');
    drawer = new MDCDrawer.attachTo(drawerEl);

    buttons = document.getElementById('buttons');

    viewButton = document.createElement('button');
    viewButton.className = 'mdc-button mdc-button--raised';
    viewButton.innerText = "Modify Walls";
    buttons.appendChild(viewButton);
    viewButton.addEventListener('click', toggleView);

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
    viewButton.innerText = "View Model";
}

export function modelButtons(){
    viewButton.innerText = "Modify Walls";
}

function createIconButton(name){

    let button = document.createElement('button');
    button.className = 'mdc-button mdc-icon-button';
    let icon = document.createElement('i');
    icon.className = 'material-icons mdc-icon-button__icon';
    icon.innerText = name;
    icon.title = name;
    icon.width = "24px";
    icon.height = "24px";
    button.appendChild(icon);
    buttons.appendChild(button);

    return button
}
