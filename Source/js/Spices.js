

(() => {

    const { log } = console;


    const menu = new Menu('Spices');
    let spices;



    function poly(sides = 3,radius = 100,size = 400){
        const array = [];

        let
            x = 0,
            y = 0
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
            offsetx = size * .5;
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

        spices = await Storage.read('Spices');

        console.log('Spices',spices);
    }

    async function saveSpices(){

        log(`Saving Spices`);

        console.log(spices);

        await Storage.write('Spices',spices);
    }


    menu.onOpen = async (editor) => {

        log(`Spices Menu Selected`);

        await requestSpices();


        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add('container');



        const preview = document.createElement('div');
        preview.id = 'Preview';
        preview.innerText = 'No Box\nSelected';


        const container = 16;



        const makePoly = (points) => {

            const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

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
            inner = poly(container * 2,160);
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

            polygon.addEventListener('click',() => {
                console.log('select',index);
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
                    let value = input.value;

                    value = value.replaceAll(/\s+/g,' ');
                    value = value.substring(0,20);
                    input.value = value;

                    value = value.trim();

                    if(value.length < 1)
                        value = null;

                    spices[index] = value;

                    saveSpices();
                });
                preview.appendChild(input);
            });

            svg.appendChild(polygon);
        });

        editor.appendChild(svg);
        editor.appendChild(preview);
    };

})();
