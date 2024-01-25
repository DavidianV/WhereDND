import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/loadSpots';
const ADD_SPOT = 'spots/addSpot'


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



export const getSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');
    console.log("THIS THING IS COOKING")

    if (res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots));
        return spots
    }
}

export const createSpot = (spotData) => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spotData)
    });
    let spot = await res.json()
    if(res.ok) {
        dispatch(addSpot(spot))
    }
}
const initialState =
{list: []}

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
            return {...state, [action.spotData.id]: action.detailedSpot }
        }
        default:
            return state;
    }
}

export default spotsReducer