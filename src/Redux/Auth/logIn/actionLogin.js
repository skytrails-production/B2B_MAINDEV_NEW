import * as types from "./actionType";

export const fetchLogIn = (user) => {
  return {
    type: types.LOGIN_SUCCESS,
    payload: user,
  };
};

export const userData = (response) => {
  return {
    type: types.USER_DATA,
    payload: response,
  };
};

export const loginAction = (user) => {
  // console.error("funtion", user);
  if (user) {
    return {
      type: types.LOGIN_REQUEST,
      payload: user,
    };
  }
};

export const walletRequest = (token) => {
  // console.error("funtion", user);

  return {
    type: types.WALLET_REQUEST,
    payload: token,
  };

};
export const walletSuccess = (response) => {
  return {
    type: types.WALLET_SUCCESS,
    payload: response,
  };
};



export const walletFail = () => {
  return {
    type: types.WALLET_FAILURE,

  };
};
export const updateWalletRequest = (token) => {
  // console.error("funtion", user);

  return {
    type: types.UPDATE_WALLET_REQUEST,
    payload: token,
  };

};
export const updateWalletSuccess = (response) => {
  return {
    type: types.UPDATE_WALLET_SUCCESS,
    payload: response,
  };
};



export const subtractWalletFail = () => {
  return {

    type: types.SUBTRACT_WALLET_FAILURE,

  };
};
export const subtractWalletRequest = (token) => {
  console.log("subtractWalletRequestAction", token);

  return {
    type: types.SUBTRACT_WALLET_REQUEST,
    payload: token,
  };

};
export const subtractWalletSuccess = (response) => {
  return {
    type: types.SUBTRACT_WALLET_SUCCESS,
    payload: response,
  };
};



export const updateWalletFail = () => {
  return {
    type: types.UPDATE_WALLET_FAILURE,

  };
};






export const successNumAfterSocialLogin = (user) => {
  return {
    type: types.VERIFY_NUM_AFTERSOCIALLOGIN_SUCCESS,
    payload: user,
  };
};



export const requestNumAfterSocialLogin = (user) => {
  // console.error("funtion", user);
  if (user) {
    return {
      type: types.VERIFY_NUM_AFTERSOCIALLOGIN_REQUEST,
      payload: user,
    };
  }
};




// UPDATE IMAGE IN MY PROFILE 


export const UpdateLoginIMAGE = (user) => {
  return {
    type: types.UPDATE_IMG_SUCCESS_MYPROFILE,
    payload: user,
  };
};



export const updateActionIMAGE = (user) => {
  // console.error("funtion", user);
  if (user) {
    return {
      type: types.UPDATE_IMG_REQUEST_MYPROFILE,
      payload: user,
    };
  }
};


// UPDATE IMAGE IN MY PROFILE 


// EDIT PROFILE SECTION 

export const editLoginIMAGE = (user) => {
  return {
    type: types.EDIT_SUCCESS_MYPROFILE,
    payload: user,
  };
};



export const editActionIMAGE = (user) => {
  // console.error("funtion", user);
  if (user) {
    return {
      type: types.EDIT_REQUEST_MYPROFILE,
      payload: user,
    };
  }
};


// EDIT PROFILE SECTION 



// login with social (google facebook)

export const fetchLogInSocial = (user) => {
  return {
    type: types.LOGIN_SUCCESS_SOCIAL,
    payload: user,
  };
};

export const userDataSocial = (response) => {
  return {
    type: types.USER_DATA,
    payload: response,
  };
};

export const loginActionSocial = (user) => {
  console.error("user details", user);
  if (user) {
    return {
      type: types.LOGIN_REQUEST_SOCIAL,
      payload: user,
    };
  }
};


export const logoutAction = () => {
  return {
    type: types.LOGOUT_REQUEST,
  };
};
export const LoginFail = (user) => {
  return {
    type: types.LOGIN_FAILURE,
    payload: user,
  };
};
