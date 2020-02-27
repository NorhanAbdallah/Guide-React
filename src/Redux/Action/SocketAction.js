<<<<<<< HEAD
=======
import io from "socket.io-client";
import {
    UPDATE_,
    FEACH_EVENT_STATE,
} from "./type";
import cookie from 'react-cookies'
import {API_ENDPOINT_SOCKET} from '../../AppConfig.js';

let socket = null;

export function init(id) {
    return (dispatch, getState) => {
        // let guideuser = cookie.load("guideuser")
        //  console.log("Guide user is: ",guideuser.id )
        socket = io(`${API_ENDPOINT_SOCKET}/utils`, {
            query: {               
                // id:guideuser.id
            }
        });
        socket.on('connect', () => { console.log('SOCKETTTTT connectsocket',socket) }
        );
        socket.on('EventCount',data=>{
            console.log("SOCKETTTTTEventCount:",data)
            dispatch({ type:FEACH_EVENT_STATE, payload: data });
        
        
        })
    }
}
export function emit(data) {
    // console.log('Redux Test socket INIT MESSAGE', data)
    // return (dispatch, getState) => {
    //     guest.emit('NewMessage', data)
    // }
}
>>>>>>> 81655bf03caa07f6041eb854e3490734ae41b76a
