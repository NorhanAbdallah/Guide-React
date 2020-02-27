import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "../Reducer";
// import logger from 'redux-logger';

const store = createStore(reducers, applyMiddleware(thunk));

export default store;