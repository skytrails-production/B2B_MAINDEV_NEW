import * as types from './markupActionType';

export const markupData = (markupData) => {
    return {
        type: types.SET_MARKUP_DATA,
        payload: markupData,
    };
}

export const getMarkUpAction = () => {
    return {
        type: types.GET_MARKUP_DATA,

    }
}