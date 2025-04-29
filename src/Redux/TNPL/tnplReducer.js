

import * as types from "./tnplActionType";

const initState = {
    tnplData: [],
    tnplUserData: [],
    verifiedOTPData: [],
    planDetails: [],
    isLoading: false,
    isError: false,
};

export const tnplReducer = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case types.FETCH_TNPL_REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };

        case types.FETCH_TNPL_SUCCESS:
            return {
                ...state,
                tnplData: payload,
                isLoading: false,
                isError: false,
            };

        case types.FETCH_TNPL_FAILURE:
            return {
                ...state,
                isLoading: false,
                isError: true,
            }

        case types.USER_DATA_REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };

        case types.USER_DATA_SUCCESS:
            return {
                ...state,
                tnplUserData: payload,
                isLoading: false,
                isError: false,
            };


        case types.SUBMIT_OTP_REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };

        case types.SUBMIT_OTP_SUCCESS:
            return {
                ...state,
                verifiedOTPData: payload,
                isLoading: false,
                isError: false,
            };


        case types.TNPL_PLANGENERATOR_REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };

        case types.TNPL_PLANGENERATOR_SUCCESS:
            return {
                ...state,
                planDetails: payload,
                isLoading: false,
                isError: false,
            };

        case types.CLEAR_TNPL_DATA:
            return {
                ...state,
                tnplUserData: [],
                verifiedOTPData: [],
                planDetails: [],
                isLoading: false,
                isError: false,
            }

        default:
            return state;
    }
};
