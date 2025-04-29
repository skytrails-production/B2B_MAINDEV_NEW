import * as types from "./actionType";

export const fetchFlightQuotesAireselRequestOneway = (data) => {

    // if (data) {
    return {
        type: types.FARE_QUOTE_RULE_AIRSEL_REQUEST_ONEWAY,
        payload: data,
        // }
    }
}
export const fetchFlightQuotesAireselSucessOneway = (data) => {
    // console.log(data, "innerdatareducer")
    if (data) {
        return {
            type: types.FARE_QUOTE_RULE_AIRSEL_SUCESS_ONEWAY,
            payload: data,
        }
    }

}
export const fetchFlightQuotesAireselFailOneway = () => {

    return {
        type: types.FARE_QUOTE_RULE_AIRSEL_FAIL_ONEWAY,

    }


}
export const fetchFlightQuotesAireselRequestReturn = (data) => {
    if (data) {
        return {
            type: types.FARE_QUOTE_RULE_AIRSEL_REQUEST_RETURN,
            payload: data,
        }
    }
}
export const fetchFlightQuotesAireselSucessReturn = (data) => {
    if (data) {
        return {
            type: types.FARE_QUOTE_RULE_AIRSEL_SUCESS_RETURN,
            payload: data,
        }
    }

}
export const fetchFlightQuotesAireselFailReturn = () => {

    return {
        type: types.FARE_QUOTE_RULE_AIRSEL_FAIL_RETURN,

    }


}
export const clearAllFareQuotesRuleAirsel = () => {
    return {
        type: types.CLEAR_ALL_FILGHT_FARE_QUOTE_AIRSEL
    }
}