import { call, put, takeLatest } from "redux-saga/effects";
import { EDIT_REQUEST_MYPROFILE, LOGIN_REQUEST, LOGIN_REQUEST_SOCIAL, SUBTRACT_WALLET_REQUEST, UPDATE_IMG_REQUEST_MYPROFILE, UPDATE_WALLET_REQUEST, VERIFY_NUM_AFTERSOCIALLOGIN_REQUEST, WALLET_REQUEST } from "../Auth/logIn/actionType";
// import { LOGIN_REQUEST, LOGIN_SUCCESS, USER_DATA } from "../Auth/logIn/actionType";
import userApi from "../API/api";
import {
  editLoginIMAGE,
  fetchLogIn,
  LoginFail,
  subtractWalletSuccess,
  successNumAfterSocialLogin,
  UpdateLoginIMAGE,
  updateWalletFail,
  updateWalletSuccess,
  walletFail
  , walletSuccess

} from "../Auth/logIn/actionLogin";

function* userLoginRequest(action) {
  try {
    // const user = yield call(userApi.userB2CLogin, action.payload);
    const user = yield call(userApi.userProfile, action.payload);
    console.log("userrrr", user);

    yield put(fetchLogIn(user?.data));

  } catch (error) {
    console.log("Login Error saga", error?.response?.data)
    var userNotFound;
    // var inValidOTP = true;
    if (error?.response?.data?.message === 'User Not found.') {
      userNotFound = true
      // yield put(fetchLogIn({ userNotFound }));
      yield put(LoginFail({ userNotFound }));
    }
    else if (error?.response?.data?.message === 'Incorrect OTP') {
      // yield put(fetchLogIn(error?.response?.data));
      yield put(LoginFail(error?.response?.data));
    }
    else {
      yield put(LoginFail(error?.response?.data));
    }

  }
}
function* verifyNumAfterSocialLogin(action) {
  try {
    const user = yield call(userApi.socialPhoneVerify, action.payload);
    yield put(successNumAfterSocialLogin(user));
  } catch (error) {
    console.log("Login Error saga", error?.response?.data)
  }
}
function* userLoginRequestWithSocialLogin(action) {
  try {
    const user = yield call(userApi.userB2CLoginWithSocial, action.payload);
    yield put(fetchLogIn(user));
  } catch (error) {
    console.log("Login Error saga", error?.response?.data)
  }
}
function* updateProfilePictureMyProfile(action) {
  try {
    const user = yield call(userApi.profilePicUpdate, action.payload);
    yield put(UpdateLoginIMAGE(user));
  } catch (error) {
    console.log("Login Error saga", error?.response?.data)
  }
}
function* editProfilePictureMyProfile(action) {
  try {
    const user = yield call(userApi.profileDataUpdate, action.payload);
    yield put(editLoginIMAGE(user));
  } catch (error) {
    console.log("Login Error saga", error?.response?.data)
  }
}
function* WalletRequest(action) {
  try {
    // const user = yield call(userApi.userB2CLogin, action.payload);
    const wallet = yield call(userApi.userWallet, action.payload);
    console.log("wallet", wallet);

    yield put(walletSuccess(wallet?.data));

  } catch (error) {
    console.log("wallet Error saga", error?.response?.data)
    var userNotFound;
    // var inValidOTP = true;
    if (error?.response?.data?.message === 'User Not found.') {
      userNotFound = true
      // yield put(fetchLogIn({ userNotFound }));
      yield put(walletFail({ userNotFound }));
    }
    else if (error?.response?.data?.message === 'Incorrect OTP') {
      // yield put(fetchLogIn(error?.response?.data));
      yield put(walletFail(error?.response?.data));
    }
    else {
      yield put(walletFail(error?.response?.data));
    }

  }
}

function* UpdateWalletRequest(action) {
  console.log("walletUpdate");
  try {
    // const user = yield call(userApi.userB2CLogin, action.payload);
    const wallet = yield call(userApi.updateUserWallet, action.payload);

    yield put(updateWalletSuccess(wallet?.data));

  } catch (error) {
    console.log("wallet Error saga", error?.response?.data)
    var userNotFound;
    // var inValidOTP = true;
    if (error?.response?.data?.message === 'User Not found.') {
      userNotFound = true
      // yield put(fetchLogIn({ userNotFound }));
      yield put(updateWalletFail({ userNotFound }));
    }
    else if (error?.response?.data?.message === 'Incorrect OTP') {
      // yield put(fetchLogIn(error?.response?.data));
      yield put(updateWalletFail(error?.response?.data));
    }
    else {
      yield put(updateWalletFail(error?.response?.data));
    }

  }
}
function* SubtractWalletRequest(action) {
  // console.log("subtractWalletRequest", action);
  try {
    // const user = yield call(userApi.userB2CLogin, action.payload);
    const wallet = yield call(userApi.subtractUserWallet, action.payload);
    console.log("subtractWalletRequest", wallet)

    yield put(subtractWalletSuccess(wallet?.data));

  } catch (error) {
    console.log("wallet subtract Error saga", error)

    yield put(updateWalletFail(error?.response?.data));


  }
}


// function* userDataRequest() {
//   try {
//     const user = yield call(userApi.loginUserData);
//     console.log('User Data Response:', user); // Log the response
//     yield put(userData(user));
//   } catch (error) {
//     console.error('Error in userDataRequest:', error);
//     yield put(userData({}));
//   }
// }

export function* loginWatcher() {
  yield takeLatest(LOGIN_REQUEST, userLoginRequest);
  yield takeLatest(WALLET_REQUEST, WalletRequest);
  yield takeLatest(UPDATE_WALLET_REQUEST, UpdateWalletRequest);
  yield takeLatest(SUBTRACT_WALLET_REQUEST, SubtractWalletRequest);

  yield takeLatest(VERIFY_NUM_AFTERSOCIALLOGIN_REQUEST, verifyNumAfterSocialLogin);
  yield takeLatest(LOGIN_REQUEST_SOCIAL, userLoginRequestWithSocialLogin);
  yield takeLatest(UPDATE_IMG_REQUEST_MYPROFILE, updateProfilePictureMyProfile);
  yield takeLatest(EDIT_REQUEST_MYPROFILE, editProfilePictureMyProfile);
  // yield takeEvery(USER_DATA, userDataRequest);
}
