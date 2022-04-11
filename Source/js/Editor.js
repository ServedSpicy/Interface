

import { create } from './Browser.js'
import Spices from './Spices.js'
import Recipe from './Recipe.js';


(() => {

    const { log } = console;


    const menu = new Menu('Editor');

    menu.onOpen = async (editor,recipe) => {

        recipe ??= new Recipe;


        const label = create('input');
        label.placeholder = 'Recipe Name';
        label.type = 'text';
        label.value = recipe.name;
        label.addEventListener('input',onEditName);
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



        const spices = Spices.spices();


        for(let s = 0;s <= 16;s++)
            addSpiceChoice(s);

        recipe.spices.forEach(spiceBox);

        updateAmount();


        function updateAmount(){

            [...amounts.children].forEach((input,index) => {

                const spice = [...used.children][index]

                log('amount',input,index,spice)

                if(!spice){
                    input.oninput = () => {};
                    return;
                }

                const name = spice.textContent;

                input.value = recipe.spices.get(name);

                input.oninput = () => {

                    const { dataset , value } = input;

                    let amount = value
                        .replace(/[^0-9]/g,'')
                        .replace(/^0/,'');


                    amount ??= '1';
                    amount = parseInt(amount);

                    if(amount < 1)
                        amount = 1;

                    if(amount > 255)
                        amount = 255;

                    input.value = amount;

                    recipe.modifySpice(name,amount);
                }
            });
        }


        function addSpiceChoice(index){

            let spice = spices[index] ?? '';
            spice = spice.trim();

            const usable = spice.length > 1;

            const color = usable
                ? Color.stringColor(spice,20,50)
                : '#9d9d9d' ;

            const box = create('div');
            box.textContent = spice;
            box.style.backgroundColor = color
            unused.appendChild(box);

            if(usable){
                box.classList.add('button');
                box.addEventListener('click',onSpiceAdd);
            }

            if(!usable || recipe.hasSpice(spice))
                box.classList.add('Empty')

            const input = create('input');
            input.value = [...recipe.spices.values()][index];
            input.type = 'text';
            amounts.appendChild(input);

            if(index >= recipe.spices.size)
                input.classList.add('Empty');




            function onSpiceAdd(){

                if(box.classList.contains('Empty'))
                    return;

                recipe.addSpice(spice,1);
                box.classList.add('Empty');

                const i = [...amounts.children][recipe.spices.size - 1];
                i.classList.remove('Empty');
                i.value = 1;

                spiceBox(1,spice);

                updateAmount();
            }
        }

        function onEditName(){

            let { value } = label;

            value = value
                .replaceAll(/\s+/g,' ')
                .substring(0,20);

            label.value = value;

            value = value.trim();

            if(value.length < 1)
                value = null;

            recipe.name = value;
            editor.style.backgroundColor = Color.stringColor(recipe.name,20,60);
        }

        function spiceBox(amount,spice){

            const box = create('div');
            box.classList.add('button');
            box.textContent = spice;
            box.style.backgroundColor = Color.stringColor(spice,20,50);
            box.addEventListener('click',onRemoveSpice);
            used.appendChild(box);

            function onRemoveSpice(){

                box.remove();
                recipe.removeSpice(spice);

                const element = [...unused.children]
                    .find((element) => element.textContent === spice);

                if(element){
                    element.classList.remove('Empty');
                    [...amounts.children][recipe.spices.size].classList.add('Empty');
                }

                updateAmount();
            }
        }
    }
})();
