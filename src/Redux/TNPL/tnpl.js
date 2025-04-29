import * as types from "./tnplActionType";

export const fetchTNPLRequest = () => {

    return {
        type: types.FETCH_TNPL_REQUEST,
    };
};

export const fetchTNPLSuccess = (data) => {
    return {
        type: types.FETCH_TNPL_SUCCESS,
        payload: data
    }
};

export const fetchTNPLFailure = (error) => {
    return {
        type: types.FETCH_TNPL_FAILURE,
        payload: error
    }
};

// export const USER_DATA_REQUEST = 'USER_DATA_REQUEST';
// export const USER_DATA_SUCCESS = 'USER_DATA_SUCCESS';

export const setUserDataSuccess = (data) => {
    return {
        type: types.USER_DATA_SUCCESS,
        payload: data,
    };
}

export const setUserDataRequest = (data) => {
    if (data) {
        return {
            type: types.USER_DATA_REQUEST,
            payload: data,
        };
    }
};


// submitoptData

export const submitOtpSuccess = (data) => {
    return {
        type: types.SUBMIT_OTP_SUCCESS,
        payload: data,
    };
}

export const submitOtpRequests = (data) => {
    if (data) {
        return {
            type: types.SUBMIT_OTP_REQUEST,
            payload: data,
        };
    }
};





export const tnplPlanGeneratorSuccess = (data) => {
    return {
        type: types.TNPL_PLANGENERATOR_SUCCESS,
        payload: data,
    };
}

export const tnplPlanGeneratorRequest = (data) => {
    if (data) {
        return {
            type: types.TNPL_PLANGENERATOR_REQUEST,
            payload: data,
        };
    }
};


export const clearTNPLReducerGRN = () => {
    return {
        type: types.CLEAR_TNPL_DATA,
    };
}