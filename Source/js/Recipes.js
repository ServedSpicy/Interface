

(() => {

    const { log } = console;
    const { useMenu } = Menu;

    const menu = new Menu('Recipes');


    menu.onOpen = async (editor) => {

        log(`Recipes Menu Selected`);


        await Recipe.load();

        const storageIndicator = create('div');
        storageIndicator.id = 'Storage';
        editor.appendChild(storageIndicator);




        function updateIndicator(){

            while(storageIndicator.children[0])
                storageIndicator.children[0].remove();

            Recipe.recipes
            .filter((recipe) => recipe.isUsed)
            .sort((a,b) => b.bytes - a.bytes)
            .forEach((recipe) => {
                const indicator = create('div');
                indicator.style.backgroundColor = recipe.color;//Color.stringColor(recipe.name);
                indicator.title = ` ${ recipe.name } ( ${ recipe.bytes } Bytes ) `;
                const percent = ((recipe.bytes / 1000) * 100);
                log(percent,recipe.bytes);
                indicator.style.width = `calc(${ percent }% - 4px)`;
                storageIndicator.appendChild(indicator);
            });
        }


        updateIndicator();


        const recipeList = create('div');
        recipeList.id = 'Recipes';


        Recipe.recipes.forEach((recipe) => {

            // const color = Color.stringColor(recipe.name,50,40);


            const tile = create('div');
            tile.style.backgroundColor = recipe.color;

            const label = create('input');
            label.style.color = recipe.color;
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
            });
            
            tile.appendChild(label);



            const options = create('div');
            options.classList.add('Options');
            tile.appendChild(options);


            const useInMachine = create('div');
            useInMachine.classList.add('checkbox');

            if(recipe.isUsed)
                useInMachine.classList.add('Checked');

            options.appendChild(useInMachine);
            useInMachine.addEventListener('click',updateCheck);

            updateCheck();

            function updateCheck(){
                const checked = useInMachine.classList.contains('Checked');
                useInMachine.classList[checked ? 'remove' : 'add']('Checked');
                useInMachine.innerHTML = `<img src = './img/${ checked ? 'Upload' : 'Unused' }.png'>`;
                recipe.isUsed = checked;
                updateIndicator();
            }


            const openEditor = create('div');
            openEditor.classList.add('button');
            openEditor.innerHTML = `<img src = './img/Edit.png'>`;
            openEditor.addEventListener('click',() => useMenu('Editor')(recipe));
            options.appendChild(openEditor);

            const removeRecipe = create('div');
            removeRecipe.classList.add('button');
            removeRecipe.innerHTML = `<img src = './img/Remove.png'>`;
            removeRecipe.addEventListener('click',() => {
                const remove = confirm("Are you sure you want to proceed?");
                if(remove){
                    recipe.delete();

                    tile.remove();
                }
            });
            options.appendChild(removeRecipe);

            recipeList.appendChild(tile);
        });

        editor.appendChild(recipeList);
    }

})();
