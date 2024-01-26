import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/loadSpots';
const ADD_SPOT = 'spots/addSpot'
const LOAD_SPOT_DETAILS = 'spots/loadSpotDetails'


const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    };
};

const addSpot = (spotData) => {
    return {
        type: ADD_SPOT,
        spotData
    }
}

const loadSpotDetails = (spotData) => {
    return {
        type: LOAD_SPOT_DETAILS,
        spotData
    }
}



export const getSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');
    //console.log("THIS THING IS COOKING")

    if (res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots));
        return spots
    }
}

export const getSpotDetails = (spotId) => async dispatch => {
    
    const res = await csrfFetch(`/api/spots/${spotId}`)
    const spotData = await res.json();
    //console.log(spotData,'###')
    if (res.ok) {
        dispatch(loadSpotDetails(spotData))
        return spotData
    }
}

export const createSpot = (spotData) => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spotData)
    });
    
    if (res.ok) {
        let spot = await res.json()
        dispatch(addSpot(spot))
    }
}
const initialState =
    { list: [] }

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const spots = {};
            action.spots.Spots.forEach(spot => {
                spots[spot.id] = spot
            });
            return {
                ...state,
                ...spots
            }
        }
        case ADD_SPOT: {
            return { ...state, [action.spotData.id]: action.spotData }
        }
        case LOAD_SPOT_DETAILS: {
            const {id} = action.spotData
            return { ...state, [id]: { ...state[id], ...action.spotData }}
        }
        default:
            return state;
    }
}

export default spotsReducer