import * as types from "./itenaryActionType";

const initState = {
    itenaryPayload: [],
    itenararyResult: [],
    flightfromData: [],
    flighttoData: [],
    selectedFlight: [],
    selectedHotel: [],
    selectedActivities: [],
    hotelResultArray: [],
    selectedHotelRoom: [],
    flightOnewayData: [],
    isLoading: false,
};



export const itenaryReducer = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case types.SAVE_PAYLOAD_REQUEST:
            return {
                ...state,
                isLoading: false,

            };
        case types.SAVE_PAYLOAD_SUCCESS:
            return {
                ...state,
                itenaryPayload: payload,
                isLoading: false,

            };


        case types.ITENERARY_SEARCH_REQUEST:

            return {
                ...state,
                isLoading: false,

            };
        case types.ITENERARY_SEARCH_SUCCESS:
            let iteResult = [...state.itenararyResult]
            iteResult.push(payload)
            return {
                ...state,
                itenararyResult: iteResult,
                isLoading: false,

            };



        case types.HOTEL_ITENERARY_REQUEST:
            return {
                ...state,
                isLoading: true,

            };

        case types.HOTEL_ITENERARY_SUCCESS:

            let hotel_array = [...state.hotelResultArray]
            hotel_array.push(payload)


            return {
                ...state,
                hotelResultArray: hotel_array,
                isLoading: false,
            };



        case types.FLIGHT_FROM_REQUEST:
            return {
                ...state,
                isLoading: true,
            };

        case types.FLIGHT_FROM_SUCCESS:
            return {
                ...state,
                flightfromData: payload,
                isLoading: false,
            };



        case types.FLIGHT_ONEWAY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };

        case types.FLIGHT_ONEWAY_SUCCESS:
            return {
                ...state,
                flightOnewayData: payload,
                isLoading: false,
            };


        case types.FLIGHT_TO_REQUEST:
            return {
                ...state,
                isLoading: true,
            };

        case types.FLIGHT_TO_SUCCESS:
            return {
                ...state,
                flighttoData: payload,
                isLoading: false,
            };


        case types.SELECTED_FLIGHT_REQUEST:
            return {
                ...state,
                isLoading: true,
            };

        case types.SELECTED_FLIGHT_SUCCESS:
            return {
                ...state,
                selectedFlight: payload,
                isLoading: false,
            };



        case types.SELECTED_HOTEL_ROOM_REQUEST:
            return {
                ...state,
                isLoading: true,
            };

        case types.SELECTED_HOTEL_ROOM_SUCCESS:

            return {
                ...state,
                selectedHotel: payload,
                isLoading: false,
            };

        case types.SELECTED_HOTELROOM_REQUEST:
            return {
                ...state,
                isLoading: true,
            };



        case types.SELECTED_HOTELROOM_SUCCESS:
            // let selectedRoom = [...state.selectedHotelRoom]
            // selectedRoom.push(payload)
            return {
                ...state,
                selectedHotelRoom: payload,
                isLoading: false,
            };


        case types.SELECTED_ACTIVITY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };

        case types.SELECTED_ACTIVITY_SUCCESS:
            return {
                ...state,
                selectedActivities: payload,
                isLoading: false,
            };

        case types.CLEAR_FLIGHT_REDUCER:
            return {
                ...state,
                selectedFlight: []
            }
        case types.CLEAR_ITENARYONEWAY_REDUCER:
            return {
                ...state,
                flightOnewayData: [],
            }
        case types.CLEAR_ITENARY_DATA:
            return {
                ...state,
                itenaryPayload: [],
                itenararyResult: [],
                flightfromData: [],
                flighttoData: [],
                selectedFlight: [],
                selectedHotel: [],
                selectedActivities: [],
                hotelResultArray: [],
                selectedHotelRoom: [],
                flightOnewayData: [],
            }

        default:
            return state;
    }
};