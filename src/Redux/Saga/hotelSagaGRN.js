import { takeLatest, call, put, takeEvery } from "redux-saga/effects";
import userApi from "../API/api";
import {
  fetchBookRoomHotelGRN,
  fetchHotel,
  singleHotelSuccess,
  HotelRoomSelectSuccessGRN,
  hotelGallerySuccess,
  fetchHotelFew,
} from "../HotelGRN/hotel";
import {
  HOTEL_B0OKROOM_REQUESTGRN,
  HOTEL_GALLERY_REQUEST,
  HOTEL_SINGLE_DETAIL_REQUEST,
  HOTEL_ROOMSELECT_REQUEST,
  HOTEL_REQUESTGRN,
  HOTEL_REQUESTGRNFEW,
} from "../HotelGRN/hotelActionType";

function* hotelRequest(action) {
  try {
    const data = yield call(userApi.hotelSearchGRN, action.payload);
    // console.log(data, "dataSaga", action.payload)
    yield put(fetchHotel(data));
  } catch (error) {
    console.log(error);
  }
}
function* hotelRequestFEW(action) {
  try {
    const data = yield call(userApi.hotelSearchGRNFew, action.payload);
    // console.log(data, "dataSaga", action.payload)
    yield put(fetchHotelFew(data));
  } catch (error) {
    console.log(error);
  }
}
function* hotelSingleDetails(action) {
  try {
    const data = yield call(userApi.hotelBookRoomGRN, action.payload);
    yield put(singleHotelSuccess(data));
  } catch (error) {
    console.log(error);
  }
}
function* hotelSelectRoom(action) {
  try {
    const data = yield call(userApi.hotelsingleDataGRN, action.payload);
    yield put(HotelRoomSelectSuccessGRN(data));
  } catch (error) {
    console.log(error);
  }
}

function* hotelGallery(action) {
  try {
    const data = yield call(userApi.hotelGalleryGRN, action.payload);
    yield put(hotelGallerySuccess(data));
  } catch (error) {
    console.log(error);
  }
}

function* hotelBookRoomRequest(action) {
  try {
    const data = yield call(userApi.hotelBookingGRN, action.payload);
    yield put(fetchBookRoomHotelGRN(data));
  } catch (error) {
    console.log(error);
  }
}

export function* hotelSearchWatcherGRN() {
  yield takeEvery(HOTEL_REQUESTGRN, hotelRequest);
  yield takeEvery(HOTEL_REQUESTGRNFEW, hotelRequestFEW);
  yield takeLatest(HOTEL_SINGLE_DETAIL_REQUEST, hotelSingleDetails);
  yield takeLatest(HOTEL_GALLERY_REQUEST, hotelGallery);
  yield takeLatest(HOTEL_ROOMSELECT_REQUEST, hotelSelectRoom);
  yield takeLatest(HOTEL_B0OKROOM_REQUESTGRN, hotelBookRoomRequest);
}
