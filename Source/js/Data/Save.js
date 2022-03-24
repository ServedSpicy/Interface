
import Socket from './Socket.js';


async function write(resource){
    return await Socket.write(resource);
}


export async function saveSpices(){
    return await write('Spices');
}

export async function saveRecipes(){
    return await write('Recipes');
}
