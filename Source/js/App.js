
import Socket from './Data/Socket.js'
import { query } from './Browser.js'

import Spices from './Spices.js'
import Recipe from './Recipe.js'

const { useMenu } = Menu;


window.addEventListener('load',async () => {

    await Socket.connect();
    await Recipe.load();
    await Spices.load();

    query('#Overview > *:first-child')
        .addEventListener('click',useMenu('Recipes'));

    query('#Overview > *:nth-child(2)')
            .addEventListener('click',useMenu('Editor'));

    query('#Overview > *:last-child')
        .addEventListener('click',useMenu('Spices'));

    Menu.useMenu('Recipes')();
});
