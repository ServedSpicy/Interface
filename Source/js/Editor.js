

import { loadRecipes } from './Data/Load.js'


(() => {

    const { log } = console;


    const menu = new Menu('Editor');

    menu.onOpen = async (editor,recipe) => {

        log(`Editor Menu Selected`);

        recipe ??= new Recipe;


        const label = create('input');

        label.placeholder = 'Recipe Name';
        label.type = 'text';
        label.value = recipe.name;
        label.addEventListener('input',() => {
            let value = label.value;

            value = value.replaceAll(/\s+/g,' ');
            value = value.substring(0,20);
            label.value = value;

            value = value.trim();

            if(value.length < 1)
                value = null;

            recipe.name = value;
            editor.style.backgroundColor = Color.stringColor(recipe.name,20,60);
        });
        editor.appendChild(label);




        const spicelists = create('div');
        spicelists.classList.add('Spices');
        editor.appendChild(spicelists);

        const used_label = create('div');
        used_label.textContent = 'Used';
        used_label.classList.add('Label');
        used_label.title = 'Spices used in your recipe.';
        spicelists.appendChild(used_label);

        spicelists.appendChild(create('div'));

        const unused_label = create('div');
        unused_label.textContent = 'Available';
        unused_label.classList.add('Label');
        unused_label.title = 'Spices you can add to your recipe.';
        spicelists.appendChild(unused_label);

        const used = create('div');
        used.classList.add('List');
        spicelists.appendChild(used);

        const amounts = create('div');
        amounts.classList.add('Amounts');
        spicelists.appendChild(amounts);

        const unused = create('div');
        unused.classList.add('List');
        spicelists.appendChild(unused);


        const spices = await loadRecipes();

        function spiceBox(spice){
            const box = create('div');
            box.classList.add('button');
            box.textContent = spice[0];
            box.style.backgroundColor = Color.stringColor(spice[0],20,50);
            used.appendChild(box);
            box.addEventListener('click',() => {

                box.remove();
                recipe.removeSpice(spice[0]);

                const element = [...unused.children]
                    .find((element) => element.textContent === spice[0]);

                if(element){
                    element.classList.remove('Empty');
                    [...amounts.children][recipe.spices.size].classList.add('Empty');
                }
            });
        }

        for(const spice of recipe.spices)
            spiceBox(spice);

        console.log(spices);

        for(let s = 0;s <= 16;s++){

            const spice = (spices[s] ?? '').trim();

            const usable = spice.length > 1;

            const color = usable
                ? Color.stringColor(spice,20,50)
                : '#9d9d9d' ;

            const box = create('div');
            const input = create('input');
            input.value = [...recipe.spices.values()][s];


            if(usable){
                box.classList.add('button');
                box.addEventListener('click',() => {

                    if(box.classList.contains('Empty'))
                        return;

                    recipe.addSpice(spice,0);
                    box.classList.add('Empty');


                    const i = [...amounts.children][recipe.spices.size - 1];
                    i.classList.remove('Empty');
                    i.value = 1;

                    spiceBox([ spice ]);
                });


            }

            if(!usable || recipe.hasSpice(spice)){
                box.classList.add('Empty')
            }
            box.textContent = spice;
            box.style.backgroundColor = color
            unused.appendChild(box);

            input.type = 'text';

            if(s >= recipe.spices.size)
                input.classList.add('Empty');

            input.addEventListener('input',(event) => {
                console.log(event);
            });
            amounts.appendChild(input);
        }
    }
})();
