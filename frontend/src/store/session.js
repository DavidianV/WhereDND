import { csrfFetch } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    };
};

const removeUser = () => {
    return {
        type: REMOVE_USER
    };
};

export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password
        })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password
        })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    });
    dispatch(removeUser());
    return response;
};


const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;
    }
};

export default sessionReducer;

// import { csrfFetch } from "./csrf";

// export const SET_SESSION_USER = 'session/SET_SESSION_USER';
// export const REMOVE_SESSION_USER = 'session/REMOVE_SESSION_USER';

// const initialState = {
//     user: null
// }

// const sessionReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case SET_SESSION_USER:
//             return { ...state, user: action.payload };
//         case REMOVE_SESSION_USER:
//             return { ...state, user: null };
//         default:
//             return state;
//     }
// }

// export const setSessionUser = (user) => ({
//     type: SET_SESSION_USER,
//     payload: user,
// });

// export const removeSessionUser = () => ({
//     type: REMOVE_SESSION_USER,
// });

// export const login = (credentials) => async (dispatch) => {
//     try {
//         const response = await csrfFetch('/api/session', {
//             method: 'POST',
//             body: JSON.stringify(credentials),
//         });

//         if (!response.ok) {
//             throw response;
//         }

//         const user = await response.json();

//         dispatch(setSessionUser(user));

//         return user;
//     } catch (err) {
//         console.error('Login error:', err);
//     }
// };

// export default sessionReducer