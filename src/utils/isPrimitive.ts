const isPrimitive = (val: unknown) => Object(val) !== val;

export default isPrimitive;
