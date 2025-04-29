import { takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";
import { getPackageBooking, openSuccessModal } from "../HolidayBook/actionBooking";
import { PACKAGE_BOOK_REQUEST } from "../HolidayBook/actionType";
// import { OPEN_SUCCESS_MODAL } from "../HolidayBook/actionType";
function* getHolidayBooking(action) {
  try {
    const user = yield call(userApi.bookingHoliday, action.payload);
    yield put(getPackageBooking(user));
    // console.log("Check Response",user);
    if (user.status === 200) {
      yield put(openSuccessModal());
    }
  } catch (error) {
    console.log(error);
  }
}
export function* getHolidayBookingWatcher() {
  yield takeLatest(PACKAGE_BOOK_REQUEST, getHolidayBooking);
}

