import * as type from '../Action/type'
import { localStorageUser } from '../../AppConfig';

const initailState = {
    token: null,
    user: localStorage.getItem(localStorageUser) ? JSON.parse(localStorage.getItem(localStorageUser)) : null,
    logged: localStorage.getItem(localStorageUser) ? true : false,
}

const UserReducer = (state = initailState, action) => {
    switch (action.type) {
        case type.SAVE_USER:
            return {
                ...state,
                user: action.payload,
                logged: true
            }
        case type.SAVE_TOKEN:
            return {
                ...state,
                token: action.payload,
                logged: true
            }
        case type.LOGOUT:
            return {
                ...state,
                user: null,
                logged: false
            }
        default:
            return state;
    }
}

export default UserReducer;


