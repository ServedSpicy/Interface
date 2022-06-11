


const buffer = {};


function toChars(string){
    return [ ... string ];
}

function color(string){
    return `color : ${ color }`;
}

function hsl(hue,saturation,lightness){
    return `hsl(${ hue },${ saturation }%,${ lightness }%)`;
}


export function stringHue(string = ''){

    let hue = 0;

    for(const char of toChars(btoa(string)))
        hue += char.charCodeAt(0);

    return hue % 255;
}


export function stringColor(string = '',saturation = 50,lightness = 50){
    return hsl(stringHue(string),saturation,lightness);
}



export const orangeA =
    color('#d19e3e');

export const blueA =
    color('#3987ff');

export const reset =
    color('unset');
