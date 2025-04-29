// import { call, put, takeLatest } from "redux-saga/effects";
// import userApi from "../API/api";
// // import {} from "../Auth/logIn/actionLogin";
// import {
//   fetchBook,
//   fetchBookGDS,
//   fetchTicketGDS,
// } from "../FlightBook/actionFlightBook";

// import {
//   FLIGHT_BOOK_REQUEST,
//   FLIGHT_BOOK_REQUEST_GDS,
//   FLIGHT_TICKET_REQUEST_GDS,
// } from "../FlightBook/actionType";

// function* bookRequest(action) {
//   try {
//     const user = yield call(userApi.flightGetTicketLcc, action.payload);
//     yield put(fetchBook(user));
//   } catch (error) {
//     yield put(fetchBook({}));
//   }
// }

// function* bookRequestGDS(action) {
//   try {
//     const user = yield call(userApi.flightBookGDS, action.payload);
//     yield put(fetchBookGDS(user));
//   } catch (error) {
//     yield put(fetchBookGDS({}));
//   }
// }

// function* bookTicketRequestGDS(action) {
//   try {
//     const data = yield call(userApi.flightGetTicketNonLcc, action.payload);
//     yield put(fetchTicketGDS(data));
//   } catch (error) {
//     yield put(fetchTicketGDS({}));
//   }
// }

// export function* flightBookWatcher() {
//   yield takeLatest(FLIGHT_BOOK_REQUEST, bookRequest);
//   yield takeLatest(FLIGHT_BOOK_REQUEST_GDS, bookRequestGDS);
//   yield takeLatest(FLIGHT_TICKET_REQUEST_GDS, bookTicketRequestGDS);
// }



import { takeEvery, call, put, takeLatest } from "redux-saga/effects";
import userApi from "../API/api";
// import { } from "../Auth/logIn/actionLogin";
import {
  fetchBook,
  fetchBookGDS,
  fetchTicketGDS,
  fetchBookReturn,
  fetchTicketGDSReturn,
  fetchBookGDSReturn
} from "../FlightBook/actionFlightBook";

import {
  FLIGHT_BOOK_REQUEST,
  FLIGHT_BOOK_REQUEST_GDS,
  FLIGHT_TICKET_REQUEST_GDS,
  FLIGHT_BOOK_REQUEST_RETURN,
  FLIGHT_TICKET_REQUEST_GDS_RETURN,
  FLIGHT_BOOK_REQUEST_GDS_RETURN
} from "../FlightBook/actionType";

function* bookRequest(action) {
  try {
    const user = yield call(userApi.flightGetTicketLcc, action.payload);
    yield put(fetchBook(user));
  } catch (error) {
    yield put(fetchBook({}));
  }
}
function* bookRequestReturn(action) {
  try {
    console.log("flightReturnBookCheck")
    const user = yield call(userApi.flightGetTicketLccReturn, action.payload);
    yield put(fetchBookReturn(user));
  } catch (error) {
    console.log(error);
    yield put(fetchBookReturn({}));
  }
}

function* bookRequestGDS(action) {
  try {
    const user = yield call(userApi.flightBookGDS, action.payload);
    yield put(fetchBookGDS(user));
  } catch (error) {
    yield put(fetchBookGDS({}));
  }
}
function* bookRequestGDSReturn(action) {
  try {
    const user = yield call(userApi.flightBookGDS, action.payload)
    yield put(fetchBookGDSReturn(user))
  } catch (error) {
    yield put(fetchBookGDSReturn({}))
  }
}


function* bookTicketRequestGDS(action) {
  try {
    const data = yield call(userApi.flightGetTicketNonLcc, action.payload);
    yield put(fetchTicketGDS(data));
  } catch (error) {
    yield put(fetchTicketGDS({}));
  }
}
function* bookTicketRequestGDSReturn(action) {
  try {
    const data = yield call(userApi.flightGetTicketNonLcc, action.payload);
    yield put(fetchTicketGDSReturn(data))
  }
  catch (error) {
    yield put(fetchTicketGDSReturn({}))
  }
}

export function* flightBookWatcher() {
  yield takeLatest(FLIGHT_BOOK_REQUEST, bookRequest);
  yield takeLatest(FLIGHT_BOOK_REQUEST_RETURN, bookRequestReturn);
  yield takeLatest(FLIGHT_BOOK_REQUEST_GDS, bookRequestGDS);
  yield takeLatest(FLIGHT_TICKET_REQUEST_GDS, bookTicketRequestGDS);
  yield takeLatest(FLIGHT_TICKET_REQUEST_GDS_RETURN, bookTicketRequestGDSReturn)
  yield takeLatest(FLIGHT_BOOK_REQUEST_GDS_RETURN, bookRequestGDSReturn)
}
