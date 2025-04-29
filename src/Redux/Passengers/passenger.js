import * as types from "./passengerActionType";

export const fetchPassengersDetails = (data) => {
  return {
    type: types.PASSENGERS_SUCCESS,
    payload: data,
  };
};

export const PassengersAction = (data) => {
  if (data) {
    return {
      type: types.PASSENGERS_REQUEST,
      payload: data,
    };
  }
};
export const fetchPassengersDetailsReturns=(data)=>{
  return{
    type:types.PASSENGERS_SUCCESS_RETURN,
    payload:data
  }
}
export const PassengersActionReturn=(data)=>{
  if(data){
    return{
      type:types.PASSENGERS_REQUEST_RETURN,
      payload:data,
    }
  }
}
// export const oneWayEMTAction = (data) => {
//   if (data) {
//     return {
//       type: types.ONE_WAY_REQUEST,
//       payload: data,
//     };
//   }
// };

export const clearPassengersReducer = () => {
  
  return {
    type: types.CLEAR_PASSENGERS_REDUCER,
  };
};
