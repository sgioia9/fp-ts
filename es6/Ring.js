var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * The `Ring` class is for types that support addition, multiplication, and subtraction operations.
 *
 * Instances must satisfy the following law in addition to the `Semiring` laws:
 *
 * - Additive inverse: `a - a = (zero - a) + a = zero`
 *
 * Adapted from https://github.com/purescript/purescript-prelude/blob/master/src/Data/Ring.purs
 *
 * @since 2.0.0
 */
import { getFunctionSemiring } from './Semiring';
/**
 * @since 2.0.0
 */
export function getFunctionRing(ring) {
    return __assign(__assign({}, getFunctionSemiring(ring)), { sub: function (f, g) { return function (x) { return ring.sub(f(x), g(x)); }; } });
}
/**
 * `negate x` can be used as a shorthand for `zero - x`
 *
 * @since 2.0.0
 */
export function negate(ring) {
    return function (a) { return ring.sub(ring.zero, a); };
}
/**
 * Given a tuple of `Ring`s returns a `Ring` for the tuple
 *
 * @example
 * import { getTupleRing } from 'fp-ts/lib/Ring'
 * import { fieldNumber } from 'fp-ts/lib/Field'
 *
 * const R = getTupleRing(fieldNumber, fieldNumber, fieldNumber)
 * assert.deepStrictEqual(R.add([1, 2, 3], [4, 5, 6]), [5, 7, 9])
 * assert.deepStrictEqual(R.mul([1, 2, 3], [4, 5, 6]), [4, 10, 18])
 * assert.deepStrictEqual(R.one, [1, 1, 1])
 * assert.deepStrictEqual(R.sub([1, 2, 3], [4, 5, 6]), [-3, -3, -3])
 * assert.deepStrictEqual(R.zero, [0, 0, 0])
 *
 * @since 2.0.0
 */
export function getTupleRing() {
    var rings = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rings[_i] = arguments[_i];
    }
    return {
        add: function (x, y) { return rings.map(function (R, i) { return R.add(x[i], y[i]); }); },
        zero: rings.map(function (R) { return R.zero; }),
        mul: function (x, y) { return rings.map(function (R, i) { return R.mul(x[i], y[i]); }); },
        one: rings.map(function (R) { return R.one; }),
        sub: function (x, y) { return rings.map(function (R, i) { return R.sub(x[i], y[i]); }); }
    };
}
