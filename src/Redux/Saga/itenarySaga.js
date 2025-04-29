
import { takeLatest, call, put, takeEvery } from "redux-saga/effects";
import userApi from "../API/api";
import { savePayloadSuccess, itenerarysearchSuccess, setFlightFromSuccess, setFlightToSuccess, setSelectedFlightSuccess, setHotelRoomSelectionSuccess, handleActivitySuccess, fetchHotelItenerary, fetchHotelSelectedRoomSuccess, itenaryOnewaySuccess } from "../Itenary/itenary";
import { SAVE_PAYLOAD_REQUEST, ITENERARY_SEARCH_REQUEST, FLIGHT_FROM_REQUEST, SELECTED_ACTIVITY_REQUEST, FLIGHT_TO_REQUEST, SELECTED_FLIGHT_REQUEST, SELECTED_HOTEL_ROOM_REQUEST, HOTEL_ITENERARY_REQUEST, SELECTED_HOTELROOM_REQUEST, FLIGHT_ONEWAY_REQUEST } from "../Itenary/itenaryActionType";

function* iteneraryPayloadRequest(action) {
    try {
        const data = yield call(userApi.iteneraryPayloadData, action.payload);
        yield put(savePayloadSuccess(data));
    } catch (error) {
        console.log(error, "error h");
    }
}

function* itenerarySearchRequest(action) {
    try {
        const data = yield call(userApi.itenerarySearch, action.payload);
        yield put(itenerarysearchSuccess(data));
    } catch (error) {
        console.log(error, "error h");
    }
}

function* flightFromSaveRequest(action) {
    try {
        const data = yield call(userApi.flightFromData, action.payload);
        yield put(setFlightFromSuccess(data));
    } catch (error) {
        console.log(error);
    }
}


function* hotelSearchRequest(action) {
    try {
        const data = yield call(userApi.hotelSearch, action.payload);
        yield put(fetchHotelItenerary(data));
    } catch (error) {
        console.log(error);
    }
}


function* flightToSaveRequest(action) {
    try {
        const data = yield call(userApi.flightToData, action.payload);
        yield put(setFlightToSuccess(data));
    } catch (error) {
        console.log(error);
    }
}

function* selectedFLightSaga(action) {
    try {
        const data = yield call(userApi.handleFlightDomestic, action.payload);
        yield put(setSelectedFlightSuccess(data));
    } catch (error) {
        console.log(error);
    }
}


function* selectedOnewayData(action) {
    try {
        const data = yield call(userApi.IterneraryOneWaySearch, action.payload);
        yield put(itenaryOnewaySuccess(data));
    } catch (error) {
        console.log(error);
    }
}


function* selectedHotelDetails(action) {
    try {
        const data = yield call(userApi.savehotelRoominItenerary, action.payload);
        yield put(setHotelRoomSelectionSuccess(data));
    } catch (error) {
        console.log(error);
    }
}


function* selectedHotelRoom(action) {
    try {
        const data = yield call(userApi.hotelSelectedRoom, action.payload);
        yield put(fetchHotelSelectedRoomSuccess(data));
    } catch (error) {
        console.log(error);
    }
}


function* selectedItenaryActivityDetails(action) {
    try {
        const data = yield call(userApi.handleItenaryActivitySelection, action.payload);
        yield put(handleActivitySuccess(data));
    } catch (error) {
        console.log(error);
    }
}



export function* IteneraryWatcher() {
    yield takeLatest(SAVE_PAYLOAD_REQUEST, iteneraryPayloadRequest);
    yield takeEvery(ITENERARY_SEARCH_REQUEST, itenerarySearchRequest);
    yield takeEvery(HOTEL_ITENERARY_REQUEST, hotelSearchRequest);
    yield takeLatest(FLIGHT_FROM_REQUEST, flightFromSaveRequest);
    yield takeLatest(FLIGHT_ONEWAY_REQUEST, selectedOnewayData);
    yield takeLatest(FLIGHT_TO_REQUEST, flightToSaveRequest);
    yield takeLatest(SELECTED_FLIGHT_REQUEST, selectedFLightSaga);
    yield takeLatest(SELECTED_HOTEL_ROOM_REQUEST, selectedHotelDetails);
    yield takeLatest(SELECTED_HOTELROOM_REQUEST, selectedHotelRoom);
    yield takeLatest(SELECTED_ACTIVITY_REQUEST, selectedItenaryActivityDetails);


}
