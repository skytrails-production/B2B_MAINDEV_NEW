import * as types from "./faqRatingTypes";
export const faqRating = (data) => {

    return {
        type: types.FAQ_RATING,
        payload: data,
    };
};
export const faqRatingListReq = (data) => {

    return {
        type: types.FAQ_RATING_LIST_REQ,
        payload: data,
    };
};
export const clearFaqRating = () => {
    return {
        type: types.CLEAR_FAQ_RATING,
    };
};
