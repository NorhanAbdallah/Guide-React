import {
    CHANGE_LANGUAGE,
} from './type';
import { localStorageCurrentLanguage } from '../../AppConfig';

export function changeLanguage(lang) {
    return (dispatch, getState) => {
        localStorage.setItem(localStorageCurrentLanguage, lang);
        dispatch({ type: CHANGE_LANGUAGE, payload: lang });
    }
}



