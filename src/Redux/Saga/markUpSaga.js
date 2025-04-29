import { takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";
import { GET_MARKUP_DATA } from "../markup/markupActionType";
import { markupData } from '../markup/markupAction';
import {LOGOUT_REQUEST} from "../Auth/logIn/actionType";


function* getMarkup() {
    try {
        const markup = yield call(userApi.markUp);
        yield put(markupData(markup));
    } catch (error) {
        console.error(error);
    }
}

function* handleLogout() {
    try {
        yield call(getMarkup); 
    } catch (error) {
        console.error(error);
    }
}


export function* watchMarkup() {
    yield takeLatest(GET_MARKUP_DATA, getMarkup);
    yield takeLatest(LOGOUT_REQUEST, handleLogout);
}
