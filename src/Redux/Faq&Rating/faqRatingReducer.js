import * as types from "./faqRatingTypes";

const initialState = {
    faqRating: {},
};

export const faqRatingReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case types.FAQ_RATING:
            return {
                faqRating: payload,
            };
        case types.CLEAR_FAQ_RATING:
            return {
                faqRating: {},
            };

        default:
            return state;
    }
};
