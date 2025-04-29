import { Wallet } from "lucide-react";
import * as types from "./actionType";

const initialState = {
  loginData: [],
  userData: [],
  token: null,
  isLogin: false,
  isLoading: false,
  isError: false,
  wallet: null
};

export const logInReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        loginData: payload,
        // token: payload,
        isLogin: true,
        isLoading: false,
        isError: false,
      };
    case types.UPDATE_IMG_SUCCESS_MYPROFILE:
      return {
        ...state,
        loginData: payload,
        // token: payload,
        isLogin: true,
        isLoading: false,
        isError: false,
      };
    case types.EDIT_SUCCESS_MYPROFILE:
      return {
        ...state,
        loginData: payload,
        // token: payload,
        isLogin: true,
        isLoading: false,
        isError: false,
      };
    case types.LOGIN_SUCCESS_SOCIAL:
      return {
        ...state,
        loginData: payload,
        // token: payload,
        isLogin: true,
        isLoading: false,
        isError: false,
      };
    case types.USER_DATA:
      return {
        ...state,
        userData: payload,
        isLogin: true,
        isLoading: false,
        isError: false,
      };

    case types.LOGIN_REQUEST:
      return {
        ...state,
        token: payload,
        isLoading: true,
        isError: false,
      };

    case types.VERIFY_NUM_AFTERSOCIALLOGIN_SUCCESS:
      return {
        ...state,
        loginData: payload,
        // token: payload,
        isLogin: true,
        isLoading: false,
        isError: false,
      };

    case types.VERIFY_NUM_AFTERSOCIALLOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };


    case types.LOGIN_REQUEST_SOCIAL:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case types.LOGIN_FAILURE:
      return {
        loginData: [],
        userData: payload,
        token: null,
        isLogin: false,
        isLoading: false,
        isError: true,
      };
    case types.LOGIN_FAILURE_SOCIAL:
      return {
        loginData: [],
        userData: [],

        isLogin: false,
        isLoading: false,
        isError: false,
      };
    case types.LOGOUT_REQUEST:
      return {
        loginData: [],
        userData: [],
        token: null,
        wallet: null,
        isLogin: false,
        isLoading: false,
        isError: false,
      };
    case types.WALLET_REQUEST:
      return {
        ...state,

        wallet: payload,

      };
    case types.WALLET_SUCCESS:
      return {
        ...state,

        wallet: payload,

      };
    case types.WALLET_FAILURE:
      return {
        ...state,

        wallet: null,

      };
    case types.UPDATE_WALLET_REQUEST:
      return {
        ...state,

        wallet: payload,

      };
    case types.UPDATE_WALLET_SUCCESS:
      return {
        ...state,

        wallet: {
          ...state?.wallet, balance: payload?.new_balance,

        }
      }
    case types.UPDATE_WALLET_FAILURE:
      return {
        ...state,

        wallet: null,

      };
    case types.SUBTRACT_WALLET_REQUEST:
      return {
        ...state,

        // wallet: payload,

      };
    case types.SUBTRACT_WALLET_SUCCESS:
      return {
        ...state,

        wallet: {
          ...state?.wallet, balance: payload?.new_balance, ...payload

        }
      }
    case types.SUBTRACT_WALLET_FAILURE:
      return {
        ...state,



      };

    default:
      return state;
  }
};
