import { takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";
import { INVENTORY_LOGIN_SUCCESS } from "../inventoryLogin/actionType";
import {
  InventoryLoginRequest,
  InventoryLoginFailure,
  InventoryLogin,
} from "../inventoryLogin/actionInventory";

function* getInventoryAuth(action) {
  let data = null;
  try {
    const user = yield call(userApi.InventoryAuth, action.payload);
    yield put(InventoryLogin(user));
  } catch (error) {
    console.log(error, "inventory login error");
    yield put(
      InventoryLoginFailure({
        error: true,
        errorMessage: error?.response?.data?.message,
      })
    );
  }
}

export function* getInventoryWatcher() {
  yield takeLatest(INVENTORY_LOGIN_SUCCESS, getInventoryAuth);
}
