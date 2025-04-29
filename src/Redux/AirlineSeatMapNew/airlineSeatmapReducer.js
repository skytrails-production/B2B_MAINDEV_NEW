import { ErrorMessage } from "formik";
import * as types from "./airlineSeatMapType";

const initialState = {
  onward: {
    seatMap: {},
    number_of_seat_map: {},
    meals: {},
    number_of_airline: {},
    seatList: {},
    amountList: [],
    amountTVO: [],
    defaultSeatOccupation: [],
    midAmount: 0,
    seatDataList: [],
    mealsList: [],
    baggageList: [],
    isError: false,
    isLoading: false,
    errorMessage: "",
    isSeatsShow: {},
  },
  return: {
    seatMap: [],
    number_of_seat_map: {},
    meals: {},
    number_of_airline: {},
    seatList: {},
    amountList: [],
    amountTVO: [],
    defaultSeatOccupation: [],
    midAmount: 0,
    seatDataList: [],
    mealsList: [],
    baggageList: [],
    isError: false,
    isLoading: false,
    errorMessage: "",
    isSeatsShow: {},
  },
};

export const airlineSeatMapReducerNew = (state = initialState, action) => {
  const { type, payload } = action;
  // console.log(action.type, action.payload, "actiononwardssr");

  switch (type) {
    case types.SSR_REQUET_ONWARD:
      return {
        ...state,
        onward: {
          number_of_airline: {},
          seatList: {},
          amountList: [],
          amountTVO: [],
          defaultSeatOccupation: [],
          midAmount: 0,
          seatDataList: [],
          mealsList: [],
          meals: {},
          baggageList: [],
          isError: false,
          isLoading: true,
          errorMessage: "",
        },
      };
    case types.SSR_REQUEST_RETURN:
      return {
        ...state,
        return: {
          number_of_airline: {},
          seatList: {},
          amountList: [],
          amountTVO: [],
          defaultSeatOccupation: [],
          midAmount: 0,
          seatDataList: [],
          mealsList: [],
          meals: {},
          baggageList: [],
          isError: false,
          isLoading: true,
          errorMessage: "",
        },
      };
    case types.SSR_SUCCESS_ONWARD:
      return {
        ...state,
        onward: action.payload,
      };
    case types.SSR_SUCCESS_RETURN:
      return {
        ...state,
        return: action.payload,
      };
    case types.SSR_FAIL_ONWARD:
      return {
        ...state,
        onward: {
          number_of_airline: {},
          seatList: {},
          amountList: [],
          amountTVO: [],
          defaultSeatOccupation: [],
          midAmount: 0,
          seatDataList: [],
          mealsList: [],
          baggageList: [],
          isError: true,
          isLoading: false,
          errorMessage: payload,
          isSeatsShow: {
            isSeat: false,
            loading: false,
          },
        },
      };
    case types.SSR_FAIL_RETURN:
      return {
        ...state,
        return: {
          number_of_airline: {},
          seatList: {},
          amountList: [],
          amountTVO: [],
          defaultSeatOccupation: [],
          midAmount: 0,
          seatDataList: [],
          mealsList: [],
          baggageList: [],
          isError: true,
          isLoading: false,
          errorMessage: payload,
          isSeatsShow: {
            isSeat: false,
            loading: false,
          },
        },
      };
    case types.NUMBER_OF_AIRLINE_ONWARD:
      return {
        ...state,
        onward: {
          ...state.onward,
          number_of_airline: payload?.no,
          seatList: payload?.seatList,
        },
        // defaultSeatOccupation: payload?.defaultSeatOccupation
      };
    case types.NUMBER_OF_AIRLINE_RETURN:
      return {
        ...state,
        return: {
          ...state.return,
          number_of_airline: payload?.no,
          seatList: payload?.seatList,
        },
        // defaultSeatOccupation: payload?.defaultSeatOccupation
      };
    case types.SEAT_SET_AIRLINE_ONWARD:
      // console.log("resucer py", payload);
      return {
        ...state,
        onward: {
          ...state.onward,
          seatList: payload,
        },
      };
    case types.SEAT_SET_AIRLINE_RETURN:
      // console.log("resucer py", payload);
      return {
        ...state,
        return: {
          ...state.return,
          seatList: payload,
        },
      };
    case types.SEAT_SET_AMOUNT_TVO_ONWARD:
      return {
        ...state,
        onward: {
          ...state.onward,
          amountTVO: payload,
        },
      };
    case types.SEAT_SET_AMOUNT_TVO_RETURN:
      return {
        ...state,
        return: {
          ...state.return,
          amountTVO: payload,
        },
      };
    case types.SEAT_SET_MID_AMOUNT_ONWARD:
      return {
        ...state,
        onward: {
          ...state.onward,
          midAmount: payload,
        },
      };
    case types.SEAT_SET_MID_AMOUNT_RETURN:
      return {
        ...state,
        return: {
          ...state.return,
          midAmount: payload,
        },
      };
    case types.DEFAULT_SEAT_OCCUPATION_ONWARD:
      return {
        ...state,
        onward: {
          ...state.onward,
          defaultSeatOccupation: payload,
        },
      };
    case types.DEFAULT_SEAT_OCCUPATION_RETURN:
      return {
        ...state,
        return: {
          ...state.return,
          defaultSeatOccupation: payload,
        },
      };
    case types.AMOUNT_SET_AIRLINE_ONWARD:
      // console.log("AMOUNT_SET_AIRLINE_ONWARD", payload);
      return {
        ...state,
        onward: {
          ...state.onward,
          amountList: payload,
        },
      };
    case types.AMOUNT_SET_AIRLINE_RETURN:
      return {
        ...state,
        return: {
          ...state.return,
          amountList: payload,
        },
      };
    case types.CLEAR_SEAT_AIRRLINE_ONWARD:
      return {
        ...state,
        onward: {
          ...state.onward,
          seatList: {},
        },
      };
    case types.CLEAR_SEAT_AIRRLINE_RETURN:
      return {
        ...state,
        return: {
          ...state.return,
          seatList: {},
        },
      };
    case types.MEAL_SET_AIRLINE_ONWARD:
      return {
        ...state,
        onward: {
          ...state.onward,
          meals: payload,
        },
      };
    case types.MEAL_SET_AIRLINE_RETURN:
      return {
        ...state,
        return: {
          ...state.return,
          meals: payload,
        },
      };
    case types.BAGGAGE_SET_AIRLINE_ONWARD:
      return {
        ...state,
        onward: {
          ...state.onward,
          baggage: payload,
        },
      };
    case types.BAGGAGE_SET_AIRLINE_RETURN:
      return {
        ...state,
        return: {
          ...state.return,
          baggage: payload,
        },
      };

    case types.CLEAR_ALL_AIRRLINE_ONWARD:
      return initialState;

    default:
      return state;
  }
};
