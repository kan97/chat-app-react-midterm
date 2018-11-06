import * as Types from '../constants/actionTypes'

const initialState = {
    authError: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SIGNIN_SUCCESS:
            return {
                ...state,
                authError: null
            }

        case Types.SIGNIN_ERROR:
            return {
                ...state,
                authError: action.err.message
            }

        case Types.SIGNIN_WITH_GOOGLE_SUCCESS:
            return {
                ...state,
                authError: null
            }

        case Types.SIGNOUT_SUCCESS:
            return state

        case Types.SIGNUP_SUCCESS:
            return {
                ...state,
                authError: null
            }

        case Types.SIGNUP_ERROR:
            return {
                ...state,
                authError: action.err.message
            }

        default:
            return state
    }
}

export default authReducer