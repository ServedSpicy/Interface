
import { query , byId } from './Browser.js'
import upload from './Data/Upload.js'
import Socket from './Data/Socket.js'
import Spices from './Spices.js'
import Recipe from './Recipe.js'
import * as Settings from './Settings.js'

const { useMenu } = Menu;


async function init(){

    await Socket.connect();
    await Recipe.load();
    await Spices.load();
    await Settings.load();


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

    byId('Upload')
        .addEventListener('click',upload);

    byId('GitHub')
        .addEventListener('click',openGitHub);

    if(Settings.has('disableWelcome'))
        byId('Welcome').remove();
    else
        byId('Welcome')
            .addEventListener('click',playWelcome);


    useMenu('Recipes');
}


function switchOn({ button , menu }){
    query(button)
        .addEventListener('click',() => useMenu(menu));
}

function openGitHub(){
    Socket.request({ action : 'openGitHub' });
}

function playWelcome(){

    Settings.set('disableWelcome');

    console.log('WELCOME')
    byId('Welcome').classList.add('Removed');
    // const audio = new Audio('audio/Welcome.wav');

    const audio = document.createElement('audio');
    audio.src = 'audio/Welcome.wav';

    audio.addEventListener('canplaythrough',() => {
        audio.volume = 0.4;
        audio.play();
    });
}

window.addEventListener('load',init);
