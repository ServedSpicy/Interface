

import { create , query } from './Browser.js'
import Recipe from './Recipe.js'


const { log } = console;
const { useMenu } = Menu;

const menu = new Menu('Recipes');


menu.onOpen = async (editor) => {

    log(`Recipes Menu Selected`);

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
            // indicator.style.backgroundColor = recipe.color;//Color.stringColor(recipe.name);
            indicator.title = ` ${ recipe.name } ( ${ recipe.bytes } Bytes ) `;
            const percent = ((recipe.bytes / 1000) * 100);
            log(percent,recipe.bytes);
            indicator.style.width = `calc(${ percent }% - 4px)`;
            storageIndicator.appendChild(indicator);
            indicator.addEventListener('mouseenter',() => {
                query(`#Recipes > #Recipe_${ recipe.name.replaceAll(' ','_') }`)?.classList.add('Selected');
            });
            indicator.addEventListener('mouseleave',() => {
                query(`#Recipes > #Recipe_${ recipe.name.replaceAll(' ','_') }`)?.classList.remove('Selected');
            });
        });
    }


    updateIndicator();


    const recipeList = create('div');
    recipeList.id = 'Recipes';


    function makeRecipe(recipe){

        const tile = create('div');
        tile.id = `Recipe_${ recipe.name.replaceAll(' ','_') }`;

        const label = create('h3');
        label.innerText = recipe.name;
        tile.appendChild(label);



        const options = create('div');
        options.classList.add('Options');
        tile.appendChild(options);


        const useInMachine = create('div');
        useInMachine.classList.add('checkbox');

        if(recipe.isUsed)
            useInMachine.classList.add('Checked');

        options.appendChild(useInMachine);

        if(recipe.spices.size > 0)
            useInMachine.addEventListener('click',updateCheck);
        else {
            useInMachine.classList.add('Blocked');
            useInMachine.title = 'Recipes without spices cannot be uploaded.';
        }

        updateCheck();

        function updateCheck(){
            const checked = useInMachine.classList.contains('Checked');
            useInMachine.classList[checked ? 'remove' : 'add']('Checked');
            useInMachine.innerHTML = `<img src = './img/${ checked ? 'Upload' : 'Unused' }.png'>`;
            recipe.isUsed = checked;
            useInMachine.title = 'Toggle Use';
            updateIndicator();
        }


        const openEditor = create('div');
        openEditor.classList.add('button');
        openEditor.innerHTML = `<img src = './img/Edit.png'>`;
        openEditor.addEventListener('click',() => useMenu('Editor',recipe));
        openEditor.title = 'Edit';
        options.appendChild(openEditor);

        const removeRecipe = create('div');
        removeRecipe.classList.add('button');
        removeRecipe.innerHTML = `<img src = './img/Remove.png'>`;
        removeRecipe.title = 'Delete';
        removeRecipe.addEventListener('click',() => {
            const remove = confirm("Are you sure you want to proceed?");
            if(remove){
                recipe.delete();

                tile.remove();
            }
        });
        options.appendChild(removeRecipe);

        recipeList.appendChild(tile);
    }


    Recipe.recipes
    .forEach(makeRecipe);

    editor.appendChild(recipeList);
}
