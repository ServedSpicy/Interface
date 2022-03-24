

import { loadRecipes } from './Data/Load.js'
import { saveRecipes } from './Data/Save.js'


(async () => {

    const { log , warn } = console;


    const recipes = new Map;


    function parseUsed(state){
        switch(typeof(state)){
        default:

            warn(`Recipes 'Used' state is not a boolean ( ${ typeof(state) } | ${ state } )`,
                 `\n\t-> Defaulting to false`);

            return false;

        case 'undefined':

            warn(`Recipe doesn't indicate if it's used`,
                 `\n\t-> Defaulting to false`);

            return false;

        case 'boolean' : return state;
        }
    }


    function parseSpices(spices){
        switch(typeof(spices)){
        default:

            warn(`Recipe does not contain Spices object data:`,spices,
                 `\n\t-> Defaulting to no spices`);

            return {};

        case 'object' : return spices;
        }
    }

    function parseSpice([ spice , amount ]){

        if(typeof(spice) != 'string'){

            warn(`The name of A spice in the recipe is not a string:`,spice,
                 `\n\t-> Ignoring spice`);

            return;
        }

        // TODO : Check if spice exists

        switch(typeof(amount)){
        default:

            warn(`The amount of a spice is not given as an integer:`,spice,typeof(amount),amount,
                 `\n\t-> Ignoring spice`);

            return;

        case 'undefined':

            warn(`The amount of a spice has not been given:`,spice,
                 `\n\t-> Ignoring spice`);

            return;

        case 'number':
            break;
        }

        try {
            amount = parseInt(amount);
        } catch (error) {
            warn(`Couldn't parse amount of spice as integer:`,spice,amount);
            return;
        }

        return [ spice , amount ];
    }


    function parseRecipe([ name , data ]){

        if(/^\s+$/.test(name)){

            warn(`Recipe name is empty:`,name,
                 `\n\t-> Ignoring Recipe`);

            return;
        }

        if(typeof(data) != 'object'){

            warn(`Recipe doesn't contain object data:`,name,data,
                 `\n\t-> Ignoring recipe`);

            return;
        }

        const { Used , Spices } = data;

        const used = parseUsed(Used);

        const spices = Object.fromEntries(
            Object.entries(parseSpices(Spices))
            .map(parseSpice)
            .filter((spice) => spice)
        );

        log(name,used,spices);

        return [ name , used , spices ];
    }


    async function load(){

        recipes.clear();

        log(`Loading Recipes`);

        const data = await loadRecipes();

        Object
        .entries(data)
        .map(parseRecipe)
        .filter((recipe) => recipe)
        .forEach((data) => {
            recipes.set(data[0],new Recipe(...data));
        });



        log('Recipes:',recipes);
    }

    async function save(){

        log(`Saving Recipes`);

        log(recipes);

        const data = {};

        recipes.forEach((recipe,name) => {
            data[name] = recipe.data;
        });

        log(`Data to be saved:`,data);

        await saveRecipes(data);
    }


    class Recipe {

        #name;
        #used;
        #spices;
        #bytes;
        #color;

        constructor(name,used,spices = []){

            this.#name = name ?? '';
            this.#used = used ?? false;
            this.#spices = new Map(Object.entries(spices));

            this.#calcBytes();
            this.#calcColor();
        }

        set name(name){

            recipes.delete(this.#name);
            this.#name = name;
            recipes.set(name,this);

            this.#calcColor();
            this.#dataChanged();
        }

        set isUsed(state){

            this.#used = state;

            this.#dataChanged();
        }

        addSpice(spice,amount){
            this.#spices.set(spice,amount);
            this.#dataChanged();
        }

        removeSpice(spice){
            this.#spices.delete(spice);
            this.#dataChanged();
        }

        hasSpice(spice){
            return this.#spices
                .has(spice);
        }

        delete(){
            recipes.delete(this.#name);
            save();
        }

        get name(){
            return this.#name;
        }

        get spices(){
            return this.#spices;
        }

        get isUsed(){
            return this.#used;
        }

        get color(){
            return this.#color;
        }

        get bytes(){
            return this.#bytes;
        }

        get color(){
            return this.#color;
        }

        #dataChanged(){
            this.#calcBytes();
            this.#save();
        }

        #calcColor(){
            this.#color = Color.stringColor(this.#name,40,50);
        }

        #calcBytes(){
            this.#bytes =
                1 + this.#name.length +
                2 * this.#spices.size;
        }

        #save(){
            save();
        }

        get data(){

            let [ Used , Spices ]
              = [ this.#used , this.#spices ];

            Spices = Object.fromEntries(Spices.entries());

            return { Used , Spices };
        }

        static async load(){
            await load();
        }

        static async save(){
            await save();
        }

        static get recipes(){
            return [...recipes.values()];
        }
    }


    window.Recipe = Recipe;

})();
