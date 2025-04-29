import * as types from "./actionType"
const initialState = {
    oneway: {},
    return: {},
    isLoading: false,
    isError: false
}
export const fareQuoteRuleAirselReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {
        case types.FARE_QUOTE_RULE_AIRSEL_REQUEST_ONEWAY:
            return {
                ...state,
                isLoading: true,
                isError: false,

            };
        case types.FARE_QUOTE_RULE_AIRSEL_SUCESS_ONEWAY:
            return {
                ...state,
                oneway: payload,
                isLoading: false,
                isError: false,
            }
        case types.FARE_QUOTE_RULE_AIRSEL_FAIL_ONEWAY:
            return {
                ...state,
                isLoading: false,
                isError: true,
            }
        case types.FARE_QUOTE_RULE_AIRSEL_REQUEST_RETURN:
            return {
                ...state,
                isLoading: true,
                isError: false,
            }
        case types.FARE_QUOTE_RULE_AIRSEL_SUCESS_RETURN:
            return {
                ...state,
                return: payload,
                isLoading: false,
                isError: false,
            }
        case types.FARE_QUOTE_RULE_AIRSEL_FAIL_RETURN:
            return {
                ...state,
                isLoading: false,
                isError: true,
            }
        case types.CLEAR_ALL_FILGHT_FARE_QUOTE_AIRSEL:
            console.log("Redux clear")
            return initialState;
        default: return state
    }

}