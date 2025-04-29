import * as types from "./returnSelectedFlightType";
export const setReturnSelectedFlight = (data) => {
    // console.log("Search Flight Action", data);
    return {
        type: types.RETURN_SELECTED_FLIGHT,
        payload: data,
    };
};
export const clearSearch = () => {
    return {
        type: types.CLEAR_RETURN_SELECTED_FLIGHT,
    };
};
