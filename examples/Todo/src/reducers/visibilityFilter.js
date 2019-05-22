import { handleActions } from 'redux-actions';


const initialState = 'SHOW_ALL'
export default handleActions({
    ['SET_VISIBILITY_FILTER']: (state, action) => {
        return action.payload
    },

    ['TEST_Promise']: (state, action) => {
        console.log('action:', action)
        return state
    }
}, initialState);