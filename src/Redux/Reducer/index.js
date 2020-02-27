import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { snackbarReducer } from 'react-redux-snackbar';
import HeaderReducer from './HeaderReducer';
import UserReducer from './UserReducer';
import SocketReducer from "./SocketReducer"

export default combineReducers({
    HeaderReducer: HeaderReducer,
    UserReducer: UserReducer,
    form: formReducer,
    snackbar: snackbarReducer,
    socket:SocketReducer,
})
