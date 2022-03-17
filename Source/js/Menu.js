


(async () => {

    const menus = new Map;
    let editor , menu;


    function prepare(){

        editor?.remove();

        editor = document.createElement('div');
        editor.id = 'Editor';

        document.body.appendChild(editor);
    }


    class Menu {

        #onOpen;
        #name;

        constructor(name){
            this.#name = name;
            menus.set(name,this);
        }

        open(...args){

            if(menu === this)
                return;

            menu = this;

            const name = this.#name;

            useTitle(`ServedSpicy ~ ${ name }`);

            prepare();

            editor.classList.add(name);

            this.#onOpen?.(editor,...args);
        }

        set onOpen(callback){
            this.#onOpen = callback;
        }

        static useMenu(name){
            return (...args) => menus
                .get(name)
                ?.open(...args);
        }
    }

    window.Menu = Menu;

})();
