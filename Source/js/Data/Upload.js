
import Socket from './Socket.js'


export default async function upload(){
    await Socket.request({ action : 'upload' });
}
