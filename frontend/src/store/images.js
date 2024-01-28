import { csrfFetch } from "./csrf";


const ADD_IMAGE = 'spots/addImage'


const addImage = (image) => {
    return {
        type: ADD_IMAGE,
        image
    }
}

export const postImage = (payload) => async dispatch => {
    const { spotId, image } = payload;


    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify(image)
    })

    if (res.ok) {
        const image = await res.json()
        console.log('--image--', image)
        dispatch(addImage(image))
        
        return image
    }
}

const initialState =
    { list: [] }

const imagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_IMAGE: {
            return {...state, [action.image.id]: action.image}
        }
        default: return state
    }
}

export default imagesReducer