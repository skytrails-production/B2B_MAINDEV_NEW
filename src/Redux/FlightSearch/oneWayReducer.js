// import { findCheapestFlights } from "../../utility/Duplicateremoveflight";
import { findCheapestFlights } from "../../utility/Duplicateremoveflight";
import * as types from "./oneWayActionType";

const initState = {
  oneWayData: [],

  isLoading: false,
  isLoadingFilter: false,

  isError: false,
  isErrorCombine: false,

  showSuccessMessage: false,
};

export const oneWayReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.ONE_WAY_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
        oneWayData: [],
      };
    case types.ONE_WAY_REQUEST_COMBINED:
      return {
        ...state,
        isLoadingFilter: true,
        isErrorCombine: false,
        oneWayData: [],
      };
    case types.ONE_WAY_FAIL:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case types.ONE_WAY_FAIL_COMBINED:
      return {
        ...state,
        isLoadingFilter: false,
        isErrorCombine: true,
      };

    case types.ONE_WAY_SUCCESS:
      return {
        ...state,
        oneWayData: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };
    case types.ONE_WAY_SUCCESS_COMBINED:
      // console.log(payload, "payload")
      const kafilatvoresponse = payload.data.result;
      const sortedFinalResult = payload.data.result.sortedFinalRes;
      const amdresukt = [...state.oneWayData.data.result];
      // console.log(amdresukt, "amd", sortedFinalResult, "sortedFinalResult");

      const removeduplicate = findCheapestFlights(amdresukt, sortedFinalResult);

      // console.log(removeduplicate, "removeduplicateremoveduplicateremoveduplicateremoveduplicateremoveduplicate")

      const newResult = [...sortedFinalResult, ...amdresukt];
      // console.log(newResult, "newresukt", removeduplicate.length, sortedFinalResult?.length, amdresukt?.length);
      const oneWayData = {
        ...state.oneWayData,
        data: {
          ...state.oneWayData.data,
          result: removeduplicate,
        },
      };
      return {
        ...state,
        // oneWayData: [...oneWayData],
        oneWayData,
        kafilatvoresponse,
        isLoadingFilter: false,
        isErrorCombine: false,
        showSuccessMessage: true,
      };

    case types.CLEAR_ONEWAY_REDUCER:
      // console.log('=======================================');
      // console.log('Resetting OneWay search state');
      return {
        ...state,
        oneWayData: [],
        isLoading: false,
        isError: false,
        isLoadingFilter: false,
        isErrorCombine: false,
        showSuccessMessage: true,
      };

    default:
      return state;
  }
};
