import * as types from "./actionTypes"
const initialState = {
    oneway: {},
    return: {},
    isLoading: false,
    isError: false
}
export const newFlightBookReducer = (state = initialState, action) => {

    const { type, payload } = action
    // console.log(action, payload, "actioninnerrr")
    switch (type) {
        case types.NEW_FLIGHT_BOOK_REQUEST_ONEWAY:
            return {
                ...state,
                isLoading: true,
                isError: false,

            };
        case types.NEW_FLIGHT_BOOK_SUCESS_ONEWAY:
            return {
                ...state,
                oneway: payload,
                isLoading: false,
                isError: false,
            }
        case types.NEW_FLIGHT_BOOK_FAIL_ONEWAY:
            return {
                ...state,
                isLoading: false,
                isError: true,
            }
        case types.NEW_FLIGHT_BOOK_REQUEST_RETURN:
            return {
                ...state,
                isLoading: true,
                isError: false,
            }
        case types.NEW_FLIGHT_BOOK_SUCESS_RETURN:
            return {
                ...state,
                return: payload,
                isLoading: false,
                isError: false,
            }
        case types.NEW_FLIGHT_BOOK_FAIL_RETURN:
            return {
                ...state,
                isLoading: false,
                isError: true,
            }
        case types.CLEAR_ALL_NEW_FILGHT_BOOK:
            // console.log("Redux clear CLEAR_ALL_NEW_FILGHT_BOOK")
            return initialState;
        default: return state
    }

}