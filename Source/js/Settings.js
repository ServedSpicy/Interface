

import { loadSettings } from './Data/Load.js'
import { saveSettings } from './Data/Save.js'


const { log , warn } = console;


let settings;


export async function load(){

    log(`Loading Settings`);

    const response = await loadSettings();

    const { error , data } = response;

    if(error){
        log('Settings data contains error',error,data);
        return;
    }

    console.log('Settings',data);

    settings = data;
}

export async function save(){

    log(`Saving Settings`);

    log(settings);

    await saveSettings(settings);
}

export function has(flag){
    return settings.flags?.includes(flag) ?? false;
}

export function set(flag){
    settings.flags ??= [];
    settings.flags.push(flag);
    save();
}
