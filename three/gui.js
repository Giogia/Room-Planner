import {toggleView} from "./src/view";

let buttons, viewButton, deleteButton;


export function createButtons(){

    buttons = document.getElementById('buttons');

    viewButton = document.createElement('button');
    viewButton.className = 'mdc-button mdc-button--raised';
    viewButton.innerText = "Modify Walls";
    buttons.appendChild(viewButton);
    viewButton.addEventListener('click', toggleView);

    deleteButton = createIconButton('delete');
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
    button.appendChild(icon);
    buttons.appendChild(button);

    return button
}
