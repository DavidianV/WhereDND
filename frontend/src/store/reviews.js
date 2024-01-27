import { csrfFetch } from "./csrf";

const LOAD_SPOT_REVIEWS = 'reviews/loadSpotReviews'
const ADD_REVIEW = 'reviews/addReview'
const LOAD_USER_REVIEWS = 'reviews/loadUserReviews'

const loadSpotReviews = (reviews) => {
    return {
        type: LOAD_SPOT_REVIEWS,
        reviews
    }
}

const addReview = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

const loadUserReviews = (userReviews) => {
    return {
        type: LOAD_USER_REVIEWS,
        userReviews
    }
}

export const getSpotReviews = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (res.ok) {
        const reviews = res.json();
        dispatch(loadSpotReviews(reviews))
        return reviews
    }
}

export const newReview = (spotId, reviewData) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
    });

    if (res.ok) {
        const review = await res.json();
        dispatch(addReview(review))
        return review
    }
}

export const getUserReviews = () => async dispatch => {
    const res = await csrfFetch(`/api/reviews/current`)

    if (res.ok) {
        const userReviews = await res.json();
        dispatch(loadUserReviews(userReviews));
        return userReviews
    }
}

const initialState =
    { list: [] }


const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOT_REVIEWS: {
            console.log(action.reviews);
            const reviews = {};
            action.reviews.forEach(review => {
                reviews[review.id] = review
            });
            return {
                ...state,
                ...reviews
            }
        }
        case ADD_REVIEW: {
            return { ...state, [action.review.id]: action.review }
        }
        case LOAD_USER_REVIEWS: {
            console.log(action.userReviews)
            const userReviews = {}
            action.userReviews.forEach(review => {
                userReviews[review.id] = review
            })
            return {
                ...state,
                ...userReviews
            }
        }
        default:
            return state;
    }
}


export default reviewsReducer
