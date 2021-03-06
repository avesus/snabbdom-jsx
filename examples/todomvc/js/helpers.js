
export function isBoolean(arg) {
  return typeof arg === 'boolean';
}

export function bind(fn, ...args) {
  return function(...args2) {
    return fn(...[...args, ...args2]);
  };
};

export function pipe(...fns) {
  return function(...args) {
    let res = fns[0](...args);
    for (var i = 1; i < fns.length; i++) {
      res = fns[i](res);
    }
    return res;
  };
};
