const Object_prototype = Object.prototype;
const Object_prototype_toString = Object_prototype.toString;

/**
 * Checks if value is a valid plain object
 * Example:
 *  function Foo() {}
 *  class Bar {}
 *  isPlainObject(Foo);                   // => false
 *  isPlainObject(Bar);                   // => false
 *  isPlainObject(new Foo());             // => false
 *  isPlainObject(new Bar());             // => false
 *  isPlainObject(new Boolean(true));     // => false
 *  isPlainObject(new Function());        // => false
 *  isPlainObject(new Date());            // => false
 *  isPlainObject(undefined);             // => false
 *  isPlainObject(void 0);                // => false
 *  isPlainObject(null);                  // => false
 *  isPlainObject(0);                     // => false
 *  isPlainObject(-7n);                   // => false
 *  isPlainObject('');                    // => false
 *  isPlainObject('hello');               // => false
 *  isPlainObject([1, 2]);                // => false
 *  isPlainObject(() => {});              // => false
 *  isPlainObject(/a[bc]+/ig);            // => false
 *  isPlainObject(Infinity);              // => false
 *  isPlainObject(-Infinity);             // => false
 *  isPlainObject(NaN);                   // => false
 *  isPlainObject(Math);                  // => false
 *  isPlainObject(Symbol);                // => false
 *  isPlainObject(window);                // => false
 *  isPlainObject(window.alert);          // => false
 *  isPlainObject(Object.create({}));     // => false
 *  isPlainObject(Object.create(null));   // => true
 *  isPlainObject({ a: 1, b: 2 });        // => true
 *  isPlainObject(new Object({}));        // => true
 */
export function isPlainObject(value: any): value is Record<string | number | symbol, any> {
  if (Object_prototype_toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object_prototype || prototype === null;
}

/**
 * Checks if value is string
 */
export function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function delay(milliseconds: number) {
  return new Promise(f => setTimeout(f, milliseconds))
}

export function throwErr<TErr>(err: TErr): never {
  throw err
}

/**
 * Synchronization primitive:
 * const deferred = new Deferred()
 * thread 1: await deferred.promise
 * thread 2: deferred.resolve(value) or deferred.reject(value)
 */
export class Deferred<T> {
  promise: Promise<T>
  // Resolve and reject are reentrant:
  // https://262.ecma-international.org/6.0/#sec-promise-resolve-functions
  resolve: (value: T | PromiseLike<T>) => void
  // https://262.ecma-international.org/6.0/#sec-promise-reject-functions
  reject: (reason?: any) => void
  constructor() {
      let cResolve = undefined
      let cReject = undefined
      this.promise = new Promise((resolve, reject) => {
          cResolve = resolve
          cReject = reject
      })
      if (!cResolve || !cReject) {
          // Expected to be impossible:
          // https://262.ecma-international.org/6.0/#sec-promise-constructor
          throw new Error("Invalid Promise constructor")
      }
      this.resolve = cResolve
      this.reject = cReject
  }
}
