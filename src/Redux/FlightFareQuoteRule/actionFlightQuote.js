import * as types from "./actionType";

export const fetchRule = (data) => {
  return {
    type: types.RULE_SUCCESS,
    payload: data,
  };
};

export const ruleAction = (data) => {
  if (data) {
    return {
      type: types.RULE_REQUEST,
      payload: data,
    };
  }
};

export const fetchQuote = (data) => {
  return {
    type: types.QUOTE_SUCCESS,
    payload: data,
  };
};

export const quoteAction = (data) => {
  if (data) {
    return {
      type: types.QUOTE_REQUEST,
      payload: data,
    };
  }
};



// return flight 


export const fetchRuleReturn = (data) => {
  return {
    type: types.RULE_SUCCESS_RETURN,
    payload: data,
  };
};


export const fetchQuoteReturn = (data) => {
  return {
    type: types.QUOTE_SUCCESS_RETURN,
    payload: data,
  };
};


export const quoteActionReturn = (data) => {
  if (data) {
    return {
      type: types.QUOTE_REQUEST_RETURN,
      payload: data,
    };
  }
};

export const ruleActionReturn = (data) => {
  if (data) {
    return {
      type: types.RULE_REQUEST_RETURN,
      payload: data,
    };
  }
};
export const FalseAllActionReturn = (data) => {
  if (data) {
    return {
      type: types.FALSE_ALL_DATA,
      payload: data,
    };
  }
};

export const setLoading = (data) => {
  return {
    type: types.SET_LOADING,
    payload: data,
  };
};


export const ClearAllActionReturn = () => {

  return {
    type: types.CLEAR_ALL_FILGHT_FARE_QUOUTE,
    payload: [],
  };

};


export const resetFareData = () => ({

  type: types.CLEAR_FARE_DETAILS_REDUCER,
});
export const resetAllFareData = () => ({

  type: types.CLEAR_ALL_FARE_DETAILS_REDUCER,
});
