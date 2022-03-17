
(async () => {
    
    const { stringify } = JSON;
    const { log } = console;
    

    window.post = (json) => window
        .webkit
       ?.messageHandlers
        .external
        .postMessage(stringify(json));

    window.byId = (id) => document
        .getElementById(id);

    window.query = (selector) => document
        .querySelector(selector);
        
    window.create = (type) => document
        .createElement(type);

    window.useTitle = (title) => {
        document.title = title;
        post({ title });
    };

})();
