import * as  types from "./flightHotelSuggestTypes";

const initialState={
    flightHotalSuggeated:{},
    isLoading:false,
    isError :false
}

export const flightHotelSuggestReducer=(state=initialState,action )=>{
    const {type,payload}=action;
    switch(type){
        case types.FLIGHT_HOTAL_LIST_REQ:
            return {
            ...state,
            isLoading:true

            }
            case types.FLIGHT_HOTAL_SUCESS:
                return{
                    ...state,
                    isLoading:false,
                    isError:false,
                    flightHotalSuggeated:payload

                }
            case types.FLIGHT_HOTEL_FAILED:
                console.log("FLIGHT_HOTEL_FAILED")
                return{
                    ...state,
                    isError:true,
                    isLoading:false
                }
            case types.FLIGHT_HOTAL_CLEAR:
                return initialState
            default: return  state;
    
}
}
