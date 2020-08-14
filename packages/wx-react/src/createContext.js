import {Emitter} from './emitter'

export let contextUid = 0

export function createContext (defaultValue) {
  const contextId = '__context_' + contextUid++ + '__'
  const context = {
    emitter: null,
    _id: contextId,
    _value: defaultValue,
    _defaultValue: defaultValue
  }
  function Provider(newValue) {
    const emitter = context.emitter
    if (!emitter) {
      context.emitter = new Emitter(defaultValue)
      context.emitter.set(newValue)
      context._value = newValue
    } else {
      emitter.set(newValue)
    }
  }
  function Consumer(component) {
    if (context.emitter && !component._isSetConsumer) {
      component._isSetConsumer = true
      context.emitter.on(value => {
        context._value = value
        component.setState({})
      })
    }
    return context._value
  }
  return {
    Provider,
    Consumer,
    context
  }
}
