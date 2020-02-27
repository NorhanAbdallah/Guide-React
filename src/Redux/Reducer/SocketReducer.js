import * as types from "../Action/type";

const initialState = {
    Current_state:null,
    NewOrder:null,
    
}
const socketReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FEACH_EVENT_STATE:
            console.log("Socket Reducer:", action.payload)
            return {
                ...state,
                Event_Count:action.payload,
            };
            // case  types.CLEAR_SOCKEt:
            //     return{
            //         NewOrder:null
            //     };
            
            // case types.FETCH_WAITINGORDER_COUNT:
            // console.log("Socket waiting Reducer:", action.payload)
            // return {
            //     ...state,
            //     WitingOrder:action.payload,
            // };

           
        default:
            return state;
    }

}

export default socketReducer;