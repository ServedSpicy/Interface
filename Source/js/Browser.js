
const { stringify } = JSON;
const { log } = console;
const { webkit } = window;


const browser = webkit
    ?.messageHandlers
     .external;


export function post(message){
    browser?.postMessage(stringify(message));
}

export function byId(id){
    return document.getElementById(id);
}

export function query(selector){
    return document.querySelector(selector);
}

export function create(type){
    return document.createElement(type);
}

export function useTitle(title){
    document.title = title;
    post({ title });
}
