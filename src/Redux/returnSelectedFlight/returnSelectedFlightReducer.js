import * as types from "./returnSelectedFlightType";

const initialState = {
    returnSelectedFlight: {},
};

export const returnSelectedFlightReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case types.RETURN_SELECTED_FLIGHT:
            return {
                returnSelectedFlight: payload
            };
        case types.CLEAR_RETURN_SELECTED_FLIGHT:
            return {
                returnSelectedFlight: {},
            };

        default:
            return state;
    }
};
