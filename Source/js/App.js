
(async () => {

    const { useMenu } = Menu;


    query('#Overview > *:first-child')
        .addEventListener('click',useMenu('Recipes'));
        
    query('#Overview > *:nth-child(2)')
            .addEventListener('click',useMenu('Editor'));

    query('#Overview > *:last-child')
        .addEventListener('click',useMenu('Spices'));

    Menu.useMenu('Recipes')();
    
})();
