
(async () => {

    const { log } = console;

    const port = 7806;


    let socket;
    let onResource;


    async function connect(address){

        log(`Connecting to websocket at ${ address }`);

        try {
            socket = new WebSocket(address);
            await prepare();
        } catch (error) {
            log(`Failed to connect to websocket`,error);
        }
    }

    function prepare(){
        return new Promise((resolve,reject) => {
            socket.onopen = () => {
                log(`Connected to websocket`);
                resolve();
            };

            socket.onmessage = (message) => {
                log(`[Websocket]: ${ message.data }`);

                try {
                    const json = JSON.parse(message.data);

                    console.log(json);

                    if(json.resource){
                        onResource?.(json.resource,json.data);
                    }
                } catch (error) {}
            };

            socket.onclose = () => {
                log(`Disconnected from websocket.`);
                socket = null;
            };
        });
    }

    function request(json){
        socket.send(JSON.stringify(json));
    }


    async function open(){

        if(socket)
            log(`Already connected to the websocket.`);
        else
            await connect(`ws://localhost:${ port }`);

        return { request ,
            onResource : (callback) => {
                onResource = callback;
            }
        };
    }


    window.Connection = { open };

})();
