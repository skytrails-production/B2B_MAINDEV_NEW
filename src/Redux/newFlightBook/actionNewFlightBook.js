import * as types from "./actionTypes";

export const fetchFlightBookRequestOneway = (data) => {

    // if (data) {
    return {
        type: types.NEW_FLIGHT_BOOK_REQUEST_ONEWAY,

        payload: data,
        // }
    }
}
export const fetchFlightBookSucessOneway = (data) => {
    console.log(data, "innerdatareducer")
    if (data) {
        return {
            type: types.NEW_FLIGHT_BOOK_SUCESS_ONEWAY,
            payload: data,
        }
    }

}
export const fetchFlightBookFailOneway = (data) => {

    return {
        type: types.NEW_FLIGHT_BOOK_FAIL_ONEWAY,
        payload: data

    }


}
export const fetchFlightBookRequestReturn = (data) => {
    if (data) {
        return {
            type: types.NEW_FLIGHT_BOOK_REQUEST_RETURN,
            payload: data,
        }
    }
}
export const fetchFlightBookSucessReturn = (data) => {
    if (data) {
        return {
            type: types.NEW_FLIGHT_BOOK_SUCESS_RETURN,
            payload: data,
        }
    }

}
export const fetchFlightBookFailReturn = (data) => {

    return {
        type: types.NEW_FLIGHT_BOOK_FAIL_RETURN,
        payload: data

    }


}
export const clearAllFlightBookNew = () => {
    return {
        type: types.CLEAR_ALL_NEW_FILGHT_BOOK
    }
}