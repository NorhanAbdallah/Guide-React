import {
    SAVE_USER,
    LOGOUT,
    SAVE_TOKEN
} from './type';
import cookie from 'react-cookies'

export function saveUser(token, userData, checked) {
    return (dispatch, getState) => {

        if (checked) {
            cookie.save('guideuser', userData, { path: "/" })
            cookie.save('guideusertoken', token, { path: "/" })
        }
        else {
            sessionStorage.guideuser = JSON.stringify(userData)
            sessionStorage.guideusertoken = token
        }
        let check = checked ? checked : false
        localStorage.setItem("remebermestate", check);
        // localStorage.setItem(localStorageUser, JSON.stringify(userData));
        dispatch({ type: SAVE_USER, payload: userData });
        dispatch({ type: SAVE_TOKEN, payload: token });
    }
}

export function ReIntializeUser(token, user) {
    return (dispatch, getState) => {
        dispatch({ type: SAVE_USER, payload: user });
        dispatch({ type: SAVE_TOKEN, payload: token });
    }
}


export function logOut() {
    return (dispatch, getState) => {
        sessionStorage.guideuser = ""
        sessionStorage.guideusertoken = ""
        cookie.save('guideuser', "", { path: "/" })
        cookie.save('guideusertoken', "", { path: "/" })
        // localStorage.removeItem(localStorageUserToken);
        // localStorage.removeItem(localStorageUser);
        dispatch({ type: LOGOUT })
    }
}



