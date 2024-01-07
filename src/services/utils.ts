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
