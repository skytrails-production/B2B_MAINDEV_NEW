import * as types from "./airlineSeatMapType";

const initialState = {
  number_of_airline: {},
  seatList: {},
  amountList: [],
  amountTVO :0,
  defaultSeatOccupation: [],
  midAmount: 0,
};

export const airlineSeatMapReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.NUMBER_OF_AIRLINE:
      return {
        ...state,
        number_of_airline: payload?.no,
        seatList: payload?.seatList,
        // defaultSeatOccupation: payload?.defaultSeatOccupation
      };
    case types.SEAT_SET_AIRLINE:
      // console.log("resucer py", payload);
      return {
        ...state,
        seatList: payload,
      };
    case types.SEAT_SET_AMOUNT_TVO:

      return {
        ...state,
        amountTVO: payload,
      };
    case types.SEAT_SET_MID_AMOUNT:
      return {
        ...state,
        midAmount: payload,
      };
    case types.DEFAULT_SEAT_OCCUPATION:
      return {
        ...state,
        defaultSeatOccupation: payload,
      };
    case types.AMOUNT_SET_AIRLINE:
      return {
        ...state,
        amountList: payload,
      };
    case types.CLEAR_SEAT_AIRRLINE:
      return {
        ...state,
        seatList: {},
      };
    case types.CLEAR_ALL_AIRRLINE:
      return initialState;

    default:
      return state;
  }
};
