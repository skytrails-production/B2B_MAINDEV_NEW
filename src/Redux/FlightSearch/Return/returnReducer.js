import * as types from "./returnActionType";
import { standardizeFlightResponse } from "../../../utility/flightUtility/standardizeFlightResponse";
import { findCheapestFlights } from "../../../utility/flightUtility/StanderdRemoveDublicateFlight";

const initState = {
  returnData: [],

  isLoading: false,
  isLoadingFilter: false,

  isError: false,
  isErrorCombine: false,

  showSuccessMessage: false,
  journeyFlightParam: [],
  returnFlightParam: [],
};

export const returnReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    // case types.RETURN_REQUEST:
    //   return {
    //     ...state,
    //     isLoading: true,
    //     isLoadingFilter: true,
    //     isError: false,
    //   };

    // case types.RETURN_SUCCESS:
    //   return {
    //     ...state,
    //     returnData: payload,
    //     isLoading: false,
    //     isError: false,
    //     showSuccessMessage: true,
    //   };
    // case types.RETURN_SEARCH_AMD:
    //   console.log(payload, "RETURN_SEARCH_AMD");

    //   return {
    //     ...state,
    //     returnData: payload,
    //     isLoadingFilter: true,
    //     isErrorCombine: false,
    //     isLoading: false,

    //   };
    case types.AMADEUS_SEARCH_RETURN_REQUEST:
      // console.log("AMADEUS_SEARCH_RETURN_REQUEST")
      return {
        ...state,

        isLoadingFilter: true,
        isErrorCombine: false,
        isLoading: true,
      };
    case types.AMADEUS_SEARCH_RETURN_SUCCESS:
      // console.log("AMADEUS_SEARCH_RETURN_SUCCESSss", payload);
      const standardizedFlights1 = payload?.journeyFlight
        ?.map((response) => standardizeFlightResponse(response))
        .filter((flight) => flight?.price); // Filter out any null results
      // console.log(standardizedFlights1, "standardizedFlightsTbo1")

      // console.log(
      //   standardizedFlights1,
      //   "standardizedFlights11",

      //   "standarderdized flight 1 in the return reducer"
      // );
      const standardizedFlights2 = payload?.returnFlight
        ?.map((response) => standardizeFlightResponse(response))
        .filter((flight) => flight?.price); // Filter out any null results
      const newPayload = {
        journeyFlight: standardizedFlights1,
        returnFlight: standardizedFlights2,
      };

      // console.log(
      //   standardizedFlights1,
      //   "standardizedFlights11",
      //   newPayload,
      //   "standarderdized flight 1 in the return reducer"
      // );

      return {
        ...state,
        returnData: newPayload,

        isErrorCombine: false,
        isLoading: false,
        isError: false,
      };
    case types.AMADEUS_SEARCH_RETURN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case types.TBO_KAFILA_SEARCH_RETURN_REQUEST:
      // console.log("TBO_KAFILA_SEARCH_RETURN_REQUEST")
      return {
        ...state,
        isErrorCombine: false,
        isLoadingFilter: true,
      };
    case types.TBO_KAFILA_SEARCH_RETURN_SUCCESS:
      // console.log(
      //   payload?.journeyFlight?.sortedFinalRes,
      //   "payload?.journeyFlight?.sortedFinalRes"
      // );
      const standardizedFlightsTbo1 =
        payload?.journeyFlight?.sortedFinalRes
          ?.map((response) => standardizeFlightResponse(response))
          .filter((flight) => flight !== null) || [];

      // console.log(
      //   standardizedFlightsTbo1,
      //   "standardizedFlightsTbo1 in line 120"
      // );

      const standardizedFlightsTbo2 = payload?.returnFlight?.sortedFinalRes
        ? payload?.returnFlight?.sortedFinalRes
          ?.map((response) => standardizeFlightResponse(response))
          .filter((flight) => flight !== null)
        : []; // Filter out any null results
      // console.log(standardizedFlightsTbo1, "datafffTBO")
      // const newJourneyFlight = [...state?.returnData?.journeyFlight, ...payload?.journeyFlight?.sortedFinalRes]
      // const newReturnFlight = [...state?.returnData?.returnFlight, ...payload?.returnFlight?.sortedFinalRes]
      console.log(
        state?.returnData?.journeyFlight,
        standardizedFlightsTbo1,
        "standardizedFlightsTbo"
      );

      const newJourneyFlight = [
        ...(state?.returnData?.journeyFlight || []),
        ...standardizedFlightsTbo1,
      ];

      const newReturnFlight = [
        ...(state?.returnData?.returnFlight || []),
        ...standardizedFlightsTbo2,
      ];
      // console.log("sorteddata", newJourneyFlight, "newJourneyFlight")
      const sortdata = findCheapestFlights(newJourneyFlight);

      const sortdataReturn = findCheapestFlights(newReturnFlight);
      // console.log(sortdata, "sorteddata", newJourneyFlight, "newJourneyFlightttt")
      // const data = [{ journeyFlight: newJourneyFlight, returnFlight: newReturnFlight }]
      const data = [{ journeyFlight: sortdata, returnFlight: sortdataReturn }];
      // const data = [{ journeyFlight: newJourneyFlight, returnFlight: newReturnFlight }]

      return {
        ...state,
        returnData: data,
        isLoadingFilter: false,
        isErrorCombine: false,

        journeyFlightParam: payload?.journeyFlight?.Param,
        journeyFlightTvoTraceId: payload?.journeyFlight?.tvoTraceId,
        returnFlightParam: payload?.returnFlight?.Param,
        returnFlightTvoTraceId: payload?.returnFlight?.tvoTraceId,
      };
    case types.TBO_KAFILA_SEARCH_RETURN_FAILURE:
      return {
        ...state,
        isLoadingFilter: false,
        isErrorCombine: true,
      };

    case types.RETURN_SEARCH_TBO_KAFILA:
      // console.log("RETURN_SEARCH_TBO_KAFILA");
      return {
        ...state,
        returnData: [...state.returnData, payload],
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };
    case types.CLEAR_RETURN_REDUCER:
      // console.log('CLEAR_RETURN_REDUCER')
      return {
        returnData: [],

        isLoading: false,
        isLoadingFilter: false,

        isError: false,
        isErrorCombine: false,

        showSuccessMessage: false,
        journeyFlightParam: [],
        returnFlightParam: [],
      };
    default:
      return state;
  }
};
