

import { loadRecipes } from './Data/Load.js'
import { saveRecipes } from './Data/Save.js'
import { stringColor } from './Color.js'


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





async function load(){

    recipes.clear();

    log(`Loading Recipes`);

    const response = await loadRecipes();

    const { error , data } = response;

    if(error){
        log('Recipe data contains error',error,data);
        return;
    }

    console.log('Recipes',response.recipes);

    let hasError = response.recipes
        .filter((recipe) => 'error' in recipe)
        .length > 0;

    if(hasError){
        log('Recipe data contains error',response.recipes);
        return;
    }

    response.recipes.forEach(({ name , used , spices }) => {
        recipes.set(name,new Recipe(name,used,spices));
    });
}

async function save(){

    log(`Saving Recipes`);

    log(recipes);

    const data = [];

    recipes.forEach((recipe) => {
        data.push(recipe.data);
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
        this.#spices = new Map(spices);

        this.#calcBytes();
        this.#calcColor();
    }

    set name(name){

        if(this.#name === name)
            return;

        recipes.delete(this.#name);
        this.#name = name;
        recipes.set(name,this);

        this.#calcColor();
        this.#dataChanged();
    }

    set isUsed(state){

        if(this.#used === state)
            return;

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

    modifySpice(spice,amount){
        this.addSpice(spice,amount);
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
        this.#color = stringColor(this.#name,40,50);
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
        return {
            name : this.#name ,
            used : this.#used ,
            spices : [...this.#spices.entries()]
        };
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


export default Recipe;
