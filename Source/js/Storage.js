

(async () => {

    async function read(resource){

        switch(resource){
        case 'Recipes':
        case 'Spices':
            break;
        default:
            throw `Unkown resource type : ${ resource }`;
        }

        const server = await Connection.open();

        await server.request({
            action : 'read' ,
            resource : resource
        });

        return await new Promise((resolve,reject) => {
            try {
                server.onResource((type,data) => {

                    console.log(type,resource,data);

                    if(type === resource)
                        resolve(data);
                });

                setTimeout(() => {
                    reject()
                },2000);
            } catch (error) {
                console.error(error);
                reject();
            }
        });
    }

    async function write(resource,data){

        switch(resource){
        case 'Recipes':
        case 'Spices':
            break;
        default:
            throw `Unkown resource type : ${ resource }`;
        }

        const server = await Connection.open();

        await server.request({
            action : 'write' ,
            resource : resource ,
            data : JSON.stringify(data)
        });
    }

    window.Storage = { read , write };

})();
