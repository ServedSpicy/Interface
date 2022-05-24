

const { log } = console;


let port = window.location.port ?? 4242;

port++;

log(`Websocket is using port: ${ port }`);

const address = `ws://localhost:${ port }`;


let socket;
let onResource;


async function request(json){

    if(!socket)
        await connect();

    socket?.send(JSON.stringify(json));
}


async function read(resource){

    await request({
        action : 'read' ,
        resource : resource
    });

    return await new Promise((resolve,reject) => {
        try {
            onResource = (type,data) => {

                console.log(type,resource,data);

                if(type === resource)
                    resolve(data);
            };

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
    await request({
        action : 'write' ,
        resource : resource ,
        data : JSON.stringify(data)
    });
}

async function connect(){

    if(socket)
        throw 'Websocket is already connected!';

    try {
        socket = new WebSocket(address);
    } catch (error) {
        log('Failed to connect to websocket',error);
        return;
    }

    await new Promise((resolve,reject) => {

        socket.onopen = () => {
            log(`Connected to websocket`);
            resolve();
        };

        socket.onmessage = (message) => {

            const { data } = message;

            log(`[Websocket]: ${ data }`);

            try {
                const json = JSON.parse(data);

                console.log(json);

                if(json.resource)
                    onResource?.(json.resource,json.data);
            } catch (error) {}
        };

        socket.onclose = () => {
            log(`Disconnected from websocket.`);
            socket = null;
        };
    });
}



export default { read , write , request , connect };
