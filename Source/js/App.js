
import Socket from './Data/Socket.js'
import { query } from './Browser.js'


const { useMenu } = Menu;


window.addEventListener('load',async () => {

    await Socket.connect();

    query('#Overview > *:first-child')
        .addEventListener('click',useMenu('Recipes'));

    query('#Overview > *:nth-child(2)')
            .addEventListener('click',useMenu('Editor'));

    query('#Overview > *:last-child')
        .addEventListener('click',useMenu('Spices'));

    Menu.useMenu('Recipes')();
});
