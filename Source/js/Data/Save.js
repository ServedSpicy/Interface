
import Socket from './Socket.js';


async function write(resource,data){
    return await Socket.write(resource,data);
}


export async function saveSpices(spices){
    return await write('Spices',spices);
}

export async function saveRecipes(recipes){
    return await write('Recipes',recipes);
}

export async function saveSettings(settings){
    return await write('Settings',settings);
}
