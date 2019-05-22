import camelCase from './toCamelCase';

const namespacer = '/';

export default type =>
  type.includes(namespacer)
    ? type
        .split(namespacer)
        .map(camelCase)
        .join(namespacer)
    : camelCase(type);
