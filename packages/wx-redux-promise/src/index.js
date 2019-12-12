function isValidKey(key) {
    return ['type', 'payload', 'error', 'meta'].indexOf(key) > -1;
}

const isPlainObject = value => {
    if (typeof value !== 'object' || value === null) return false;

    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(value) === proto;
}

const isString = value => typeof value === 'string';


function isFSA(action) {
    return (
        isPlainObject(action) &&
        isString(action.type) &&
        Object.keys(action).every(isValidKey)
    );
}

function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export default function promiseMiddleware({ dispatch }) {
    return next => action => {
        if (!isFSA(action)) {
            return isPromise(action) ? action.then(dispatch) : next(action);
        }

        return isPromise(action.payload)
            ? action.payload
                .then(result => dispatch({ ...action, payload: result }))
                .catch(error => {
                    dispatch({ ...action, payload: error, error: true });
                    return Promise.reject(error);
                })
            : next(action);
    };
}