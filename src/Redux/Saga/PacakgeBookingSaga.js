import { call, put, takeEvery } from "redux-saga/effects";
import { packageBookingID } from "../BookingPackageData/actionBooking";


function* handleSubmitFormData(action) {
  try {
    // Perform your API call or data submission here
    const response = yield call(packageBookingID, action.payload);

    // Dispatch a success action if needed
    yield put({ type: 'SUBMIT_FORM_SUCCESS', payload: response });
  } catch (error) {
    // Dispatch an error action if needed
    yield put({ type: 'SUBMIT_FORM_ERROR', error });
  }
}

export function* watchSubmitFormData() {
  yield takeEvery('SUBMIT_FORM_SUCCESS', handleSubmitFormData);
}
