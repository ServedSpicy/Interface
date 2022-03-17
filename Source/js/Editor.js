

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
        
        
        
        
        const spices = create('div');
        spices.classList.add('Spices');
        editor.appendChild(spices);
        
        const used_label = create('div');
        used_label.textContent = 'Used';
        used_label.classList.add('Label');
        used_label.title = 'Spices used in your recipe.';
        spices.appendChild(used_label);
        
        const unused_label = create('div');
        unused_label.textContent = 'Available';
        unused_label.classList.add('Label');
        unused_label.title = 'Spices you can add to your recipe.';
        spices.appendChild(unused_label);
        
        const used = create('div');
        used.classList.add('List');
        spices.appendChild(used);
        
        const unused = create('div');
        unused.classList.add('List');
        spices.appendChild(unused);
        
        
        for(const spice of recipe.spices){
            const box = create('div');
            box.classList.add('button');
            box.textContent = spice[0];
            box.style.backgroundColor = Color.stringColor(spice[0],20,50);
            used.appendChild(box);
            box.addEventListener('click',() => {}); // TODO
        }
    }
})();
