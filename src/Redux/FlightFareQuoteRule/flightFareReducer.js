import * as types from "./actionType";

const initialState = {
  flightRuleData: {},
  flightQuoteData: {},
  flightRuleDataReturn: {},
  flightQuoteDataReturn: {},
  isLogin: false,
  isLoadingRuleDone: false,
  isLoadingQuoteDoneReturn: false,
  isLoadingRuleDoneReturn: false,
  isLoadingQuoteDone: false,
  isError: false,
};

export const flightFareReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.RULE_SUCCESS:
      return {
        ...state,
        flightRuleData: payload?.data?.data?.Response,
        isLoading: false,
        isLoadingRuleDone: true,
        isError: false,
      };

    case types.RULE_REQUEST:
      return {
        ...state,
        isLoadingRuleDone: false,
        isError: false,
      };

    case types.QUOTE_SUCCESS:
      return {
        ...state,
        flightQuoteData: payload?.data?.data?.Response,
        isLoadingQuoteDone: true,
        isError: false,
      };

    case types.QUOTE_REQUEST:
      return {
        ...state,
        isLoading: true,
        isLoadingQuoteDone: false,
        isError: false,
      };


    case types.QUOTE_REQUEST_RETURN:
      return {
        ...state,
        isLoadingQuoteDoneReturn: false,
        isError: false,
      };

    case types.QUOTE_SUCCESS_RETURN:
      return {
        ...state,
        flightQuoteDataReturn: payload?.data?.data?.Response,
        isLoadingQuoteDoneReturn: true,
        isError: false,
      };

    case types.RULE_REQUEST_RETURN:
      return {
        ...state,
        isLoadingRuleDoneReturn: false,
        isError: false,
      };

    case types.RULE_SUCCESS_RETURN:
      return {
        ...state,
        flightRuleDataReturn: payload?.data?.data?.Response,
        isLoadingRuleDoneReturn: true,
        isError: false,
      };
    case types.CLEAR_FARE_DETAILS_REDUCER:
      // console.log('=======================================');
      // console.log('Resetting Fare details state');
      return {
        ...state,
        flightRuleData: {},
        flightQuoteData: {},
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };

    case types.SET_LOADING:
      return {
        ...state,
        isLoadingQuoteDone: false,
        isLoadingRuleDone: false,
      };
    case types.CLEAR_ALL_FARE_DETAILS_REDUCER:

      return {

        flightRuleData: {},
        flightQuoteData: {},
        flightRuleDataReturn: {},
        flightQuoteDataReturn: {},
        isLogin: false,
        isLoading: false,
        isError: false,
        isLogin: false,
        isLoadingRuleDone: false,
        isLoadingQuoteDoneReturn: false,
        isLoadingRuleDoneReturn: false,
        isLoadingQuoteDone: false,
        isError: false,

      };

    default:
      return state;
  }
};
