import * as type from '../Action/type'
import { localStorageCurrentLanguage } from '../../AppConfig';

const initailState = {
    appLanguage: localStorage.getItem(localStorageCurrentLanguage) ? localStorage.getItem(localStorageCurrentLanguage) : "en",
}

const HeaderReducer = (state = initailState, action) => {
    switch (action.type) {
        case type.CHANGE_LANGUAGE:
            
            return {
                ...state,
                appLanguage: action.payload
            }
        default:
            return state

    }
}

export default HeaderReducer;


