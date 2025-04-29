import { takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";
import { busSearch, busSeatBlock, busBook, busBookDetails } from "../busSearch/busSearchAction";
import { BUS_SEARCH_REQUEST, BUS_BLOCK_REQUEST, BUS_BOOK_REQUEST, BUS_DETAILS_REQUEST } from "../busSearch/actionType";

function* busSearchSaga(action) {
  try {
    const user = yield call(userApi.getBusSearch, action.payload);
    yield put(busSearch(user));
  } catch (error) {
    // console.log(error);
  }
}
function* busSeatBlockSaga(action) {
  try {
    const data = yield call(userApi.busBlock, action.payload);
    yield put(busSeatBlock(data))
  } catch (error) {
    // console.log(error)
  }
}
function* busBookSaga(action) {
  try {
    const data = yield call(userApi.busBook, action.payload);
    yield put(busBook(data))
  }
  catch (error) {
    // console.log(error)
  }
}
function* busBookGetDetailsSaga(action) {

  try {
    const data = yield call(userApi.busBookDetails, action.payload);
    console.error("check bookbusDetails response.........", data);
    yield put(busBookDetails(data));
  } catch (error) {
    // console.log(error);
  }
}
export function* busSearchWatcher() {
  yield takeLatest(BUS_SEARCH_REQUEST, busSearchSaga);
  yield takeLatest(BUS_BLOCK_REQUEST, busSeatBlockSaga);
  yield takeLatest(BUS_BOOK_REQUEST, busBookSaga);
  yield takeLatest(BUS_DETAILS_REQUEST, busBookGetDetailsSaga);
}
