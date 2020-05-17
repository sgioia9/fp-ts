import { pipeable } from './pipeable';
/**
 * @since 2.0.0
 */
export var URI = 'Eq';
/**
 * @since 2.0.0
 */
export function fromEquals(equals) {
    return {
        equals: function (x, y) { return x === y || equals(x, y); }
    };
}
/**
 * @since 2.5.0
 */
export var eqStrict = {
    // tslint:disable-next-line: deprecation
    equals: strictEqual
};
/**
 * Use `eqStrict` instead
 *
 * @since 2.0.0
 * @deprecated
 */
export function strictEqual(a, b) {
    return a === b;
}
/**
 * @since 2.0.0
 */
export var eqString = eqStrict;
/**
 * @since 2.0.0
 */
export var eqNumber = eqStrict;
/**
 * @since 2.0.0
 */
export var eqBoolean = eqStrict;
/**
 * @since 2.0.0
 */
export function getStructEq(eqs) {
    return fromEquals(function (x, y) {
        for (var k in eqs) {
            if (!eqs[k].equals(x[k], y[k])) {
                return false;
            }
        }
        return true;
    });
}
/**
 * Given a tuple of `Eq`s returns a `Eq` for the tuple
 *
 * @example
 * import { getTupleEq, eqString, eqNumber, eqBoolean } from 'fp-ts/lib/Eq'
 *
 * const E = getTupleEq(eqString, eqNumber, eqBoolean)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
 *
 * @since 2.0.0
 */
export function getTupleEq() {
    var eqs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        eqs[_i] = arguments[_i];
    }
    return fromEquals(function (x, y) { return eqs.every(function (E, i) { return E.equals(x[i], y[i]); }); });
}
/**
 * @since 2.0.0
 */
export var eq = {
    URI: URI,
    contramap: function (fa, f) { return fromEquals(function (x, y) { return fa.equals(f(x), f(y)); }); }
};
var pipeables = /*@__PURE__*/ pipeable(eq);
var contramap = /*@__PURE__*/ (function () { return pipeables.contramap; })();
export { 
/**
 * @since 2.0.0
 */
contramap };
/**
 * @since 2.0.0
 */
export var eqDate = eq.contramap(eqNumber, function (date) { return date.valueOf(); });
var empty = {
    equals: function () { return true; }
};
/**
 * @since 2.6.0
 */
export function getMonoid() {
    return {
        concat: function (x, y) { return fromEquals(function (a, b) { return x.equals(a, b) && y.equals(a, b); }); },
        empty: empty
    };
}
