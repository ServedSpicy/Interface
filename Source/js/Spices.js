
import { loadSpices } from './Data/Load.js'
import { saveSpices } from './Data/Save.js'
import { stringColor , stringHue } from './Color.js'


const { log } = console;


const menu = new Menu('Spices');
let spices = [];



function poly(sides = 3,radius = 100,size = 400){
    const array = [];

    let
        x = 0,
        y = 0,
        angle = 0;


    const alpha = (2 * Math.PI) / sides;
    const chord = 2 * radius * Math.sin(alpha / 2);

    array.push([ x , y ]);

    for(let p = 0;p < sides;p++,angle += alpha){

        x += Math.sin(angle) * chord;
        y += Math.cos(angle) * chord;

        array.push([ x , y ]);
    }

    let
        offsetx = size * .5,
        offsety = size * .5;

    offsetx -= radius;
    offsety -= chord * .5;

    return array
        .map(([ x , y ]) => [
            x + offsetx ,
            y + offsety
        ]);
}



async function requestSpices(){

    log(`Requesting Spices`);

    const response = await loadSpices();

    const { error , data } = response;

    if(error){
        log('Spices data contains error',error,data);
        return;
    }

    console.log('Spices',response.spices);

    spices = response.spices;
}

async function save(){

    log(`Saving Spices`);

    console.log(spices);

    await saveSpices(spices);
}


menu.onOpen = async (editor) => {

    log(`Spices Menu Selected`);


    const pointer = document.createElement('img');
    pointer.src = 'img/Pointer.png';
    pointer.id = 'Pointer';
    editor.appendChild(pointer);


    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add('container');



    const preview = document.createElement('div');
    preview.id = 'Preview';
    preview.innerText = 'No Box\nSelected';


    const container = 16;



    const makePoly = (points) => {

        const polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');

        for(const [ x , y ] of points){
            const point = svg.createSVGPoint();
            point.x = x;
            point.y = y;
            polygon.points.appendItem(point);
        }

        return polygon;
    };


    const polys = [];

    const
        inner = poly(container * 2,160),
        outer = poly(container * 2,190);


    for(let p = 0;p < container * 2;p += 2){
        polys.push([
            inner[p] ,
            inner[p + 1] ,
            outer[p + 1] ,
            outer[p]
        ]);
    }

    let selected;

    polys.forEach((points,index) => {

        const polygon = makePoly(points);

        index += .25 * container;

        if(index > container)
            index -= container;

        index = container - index;

        const spice = spices[index];

        if(spice){
            // polygon.style.fill = stringColor(spice);
            // polygon.style.stroke = stringColor(spice);
            polygon.style.setProperty('--stroke',`hsl(${ stringHue(spice) },50%,70%)`);
            polygon.style.setProperty('--color',stringColor(spice));
        }

        polygon.addEventListener('click',() => {

            const { x , y , width , height } = svg.getBoundingClientRect();
            const [ cx , cy ] = [ x + .5 * width , y + .5 * height ];

            const angle = index * Math.PI * 2 / 16;

            pointer.style.left = `${ cx - 10 + Math.sin(angle) * 135 }px`;
            pointer.style.top = `${ cy - 10 - Math.cos(angle) * 135 - 130 }px`;
            pointer.style.transform = `rotate(${ angle }rad)`;
            pointer.style.visibility = 'unset';

            preview.classList.add('Selected');
            selected?.classList.remove('Selected');
            polygon.classList.add('Selected');

            selected = polygon;

            preview.innerHTML = `<h1>BOX#${ index }</h1>`;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Spice Name';
            input.value = spices[index] ?? '';
            input.addEventListener('input',(event) => {

                let value = input.value
                    .replaceAll(/\s+/g,' ')
                    .substring(0,20);

                input.value = value;

                value = value.trim();

                if(value.length < 1)
                    value = null;

                spices[index] = value;

                save();
            });

            preview.appendChild(input);
        });

        svg.appendChild(polygon);
    });

    editor.appendChild(svg);
    editor.appendChild(preview);
};


export default { load : requestSpices , spices : () => spices };
