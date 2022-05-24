
import Socket from './Data/Socket.js'
import { query } from './Browser.js'

import Spices from './Spices.js'
import Recipe from './Recipe.js'

const { useMenu } = Menu;


async function init(){

    await Socket.connect();
    await Recipe.load();
    await Spices.load();


    switchOn({
        button : '#Overview > *:first-child' ,
        menu : 'Recipes'
    });

    switchOn({
        button : '#Overview > *:nth-child(2)' ,
        menu : 'Editor'
    });

    switchOn({
        button : '#Overview > *:last-child' ,
        menu : 'Spices'
    });


    useMenu('Recipes');
}


function switchOn({ button , menu }){
    query(button)
        .addEventListener('click',() => useMenu(menu));
}


window.addEventListener('load',init);
