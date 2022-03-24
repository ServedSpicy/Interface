
import Socket from './Socket.js'
import { byId } from '../Browser.js'


window.addEventListener('load',() => {

    byId('Upload')
    .addEventListener('click',upload);
});


export default function upload(){
    Socket.request({ action : 'upload' });
}
