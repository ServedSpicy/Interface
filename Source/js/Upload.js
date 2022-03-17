

(async () => {


    async function upload(){

        const server = await Connection.open();

        await server.request({
            action : 'upload'
        });
    }

    byId('Upload')
    .addEventListener('click',upload);

})();
