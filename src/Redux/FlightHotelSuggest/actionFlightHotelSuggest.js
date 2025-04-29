import * as types from "./flightHotelSuggestTypes";

export const flightHotelSuggestListReq=(data)=>{
    console.log("ffffff")
    return{
        type:types.FLIGHT_HOTAL_LIST_REQ,
        payload:data
    }
}
export const flightHotelSuggest=(data)=>{
    console.log("flighsugpatch")
    return {
        type:types.FLIGHT_HOTAL_SUCESS,
        payload:data
    }

}

export const flightHotalSuggestFail=(data)=>{
    return{
        type:types.FLIGHT_HOTEL_FAILED,
        payload:data
    }
}

export const flightHotalSuggesteClear=()=>{
    return {
        type:types.FLIGHT_HOTAL_CLEAR
    }
}