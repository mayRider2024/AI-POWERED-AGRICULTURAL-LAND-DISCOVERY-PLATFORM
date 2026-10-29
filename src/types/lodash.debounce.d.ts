// src/types/lodash.debounce.d.ts
declare module 'lodash.debounce' {
  type AnyFunction = (...args: any[]) => any;
  function debounce<F extends AnyFunction>(func: F, wait?: number): F;
  export default debounce;
}
