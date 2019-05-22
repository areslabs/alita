import createAction from './createAction';

function curry(fn, arity) {
    return function curried() {
        if (arity == null) {
            arity = fn.length;
        }
        var args = [].slice.call(arguments);
        if (args.length >= arity) {
            return fn.apply(this, args);
        } else {
            return function() {
                return curried.apply(this, args.concat([].slice.call(arguments)));
            };
        }
    };
}

export default (type, payloadCreator) =>
  curry(createAction(type, payloadCreator), payloadCreator.length);
