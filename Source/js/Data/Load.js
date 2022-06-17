
import Socket from './Socket.js';


async function read(resource){
    return await Socket.read(resource);
}


export async function loadSpices(){
    return await read('Spices');
}

export async function loadRecipes(){
    return await read('Recipes');
}

export async function loadSettings(){
    return await read('Settings');
}
