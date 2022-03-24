

async function read(resource){

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


export default { read };
