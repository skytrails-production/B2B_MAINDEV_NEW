import * as types from "./actionType";
const initialState = {
  inventoryloginData: [],
  isLogin: false,
  isError: false,
  isLoading: false,
};

export const InventoryReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.INVENTORY_LOGIN_SUCCESS:
      return {
        inventoryloginData: payload,
        isLogin: true,
        isError: false,
        isLoading: false,
      };
    case types.INVENTORY_LOGOUT_SUCCESS:
      return {
        inventoryloginData: [],
        isLogin: true,
        isError: false,
        isLoading: false,
      };
      case types.INVENTORY_LOGIN_REQUEST:
        return {
          ...state,
  
          isError: false,
          isLoading: true,
        };
    case types.INVENTORY_LOGIN_FAILURE:
      return {
        ...state,

        isError: true,
        isLoading: false,
      };
      default: return state;
  }
};
