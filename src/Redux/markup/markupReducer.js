import * as types from "./markupActionType";

const initState = {
    markUpData: [],

};

export const markUpDataReducer = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case types.GET_MARKUP_DATA:
            return {
                ...state,

            };

        case types.SET_MARKUP_DATA:
            return {
                ...state,
                markUpData: payload,
            };


        default:
            return state;
    }
};