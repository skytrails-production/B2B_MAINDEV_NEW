import * as types from "./itenaryActionType";


export const savePayloadrRequest = (data) => {
    if (data) {
        return {
            type: types.SAVE_PAYLOAD_SUCCESS,
            payload: data,
        };
    }
}
export const savePayloadSuccess = (data) => {
    return {
        type: types.SAVE_PAYLOAD_SUCCESS,
        payload: data,
    };
}

export const itenerarysearchRequest = (data) => {
    if (data) {
        return {
            type: types.ITENERARY_SEARCH_REQUEST,
            payload: data,
        }
    }
}


export const itenerarysearchSuccess = (data) => {

    return {
        type: types.ITENERARY_SEARCH_SUCCESS,
        payload: data,
    }

}


// hotel search redux


export const fetchHotelItenerary = (data) => {
    return {
        type: types.HOTEL_ITENERARY_SUCCESS,
        payload: data,
    };
};

export const hotelActionItenerary = (data) => {
    if (data) {
        return {
            type: types.HOTEL_ITENERARY_REQUEST,
            payload: data,
        };
    }
};



export const fetchHotelSelectedRoomSuccess = (data) => {
    return {
        type: types.SELECTED_HOTELROOM_SUCCESS,
        payload: data,
    };
};

export const fetchHotelSelectedRoomRequest = (data) => {
    if (data) {
        return {
            type: types.SELECTED_HOTELROOM_REQUEST,
            payload: data,
        };
    }
};


// hotel search redux 





// itenary flight from


export const setFLightFromRequest = (data) => {
    if (data) {
        return {
            type: types.FLIGHT_FROM_REQUEST,
            payload: data,
        };
    }
};

export const setFlightFromSuccess = (data) => {
    return {
        type: types.FLIGHT_FROM_SUCCESS,
        payload: data,
    };
}





// itenary flight from


// itenary flight to 

export const setFLightToRequest = (data) => {
    if (data) {
        return {
            type: types.FLIGHT_TO_REQUEST,
            payload: data,
        };
    }
};

export const setFlightToSuccess = (data) => {
    return {
        type: types.FLIGHT_TO_SUCCESS,
        payload: data,
    };
}


// itenary flight to




// handle flight oneway


export const itenaryOnewayRequest = (data) => {
    if (data) {
        return {
            type: types.FLIGHT_ONEWAY_REQUEST,
            payload: data,
        };
    }
};

export const itenaryOnewaySuccess = (data) => {
    return {
        type: types.FLIGHT_ONEWAY_SUCCESS,
        payload: data,
    };
}



// handle flight oneway 




// handle domestic return 

export const setSelectedFlightRequest = (data) => {
    if (data) {
        return {
            type: types.SELECTED_FLIGHT_REQUEST,
            payload: data,
        };
    }
};


export const setSelectedFlightSuccess = (data) => {
    return {
        type: types.SELECTED_FLIGHT_SUCCESS,
        payload: data,
    };
}




// hotel room selection


export const setHotelRoomSelectionRequest = (data) => {
    if (data) {
        return {
            type: types.SELECTED_HOTEL_ROOM_REQUEST,
            payload: data,
        };
    }
};

export const setHotelRoomSelectionSuccess = (data) => {
    return {
        type: types.SELECTED_HOTEL_ROOM_SUCCESS,
        payload: data,
    };
}



// hotel room selection




// handle activity selection 


export const handleActivityRequest = (data) => {
    console.log(data, "data")
    if (data) {
        return {
            type: types.SELECTED_ACTIVITY_REQUEST,
            payload: data,
        };
    }
};

export const handleActivitySuccess = (data) => {
    return {
        type: types.SELECTED_ACTIVITY_SUCCESS,
        payload: data,
    };
}




// handle activity selection 







export const clearFlightSelectedIteneraryReducer = () => {
    return {
        type: types.CLEAR_FLIGHT_REDUCER,
    };
}


export const clearOneWayItenary = () => {
    return {
        type: types.CLEAR_ITENARYONEWAY_REDUCER,
    };
}




export const clearItenaryRecuder = () => {
    return {
        type: types.CLEAR_ITENARY_DATA,
    };
}