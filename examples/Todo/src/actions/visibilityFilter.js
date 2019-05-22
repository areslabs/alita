import { createActions } from 'redux-actions';

export default createActions({
    ['SET_VISIBILITY_FILTER']: (filter) => {
        return filter
    },

    ['TEST_Promise']: () =>  new Promise((resolve) => {
        setTimeout(() => resolve('Promise OK!'), 3000)
    }),

    ['TEST_Thunk']: () => {
        console.log('Thunk OK!')
    }
})