import { array, empty, getEq as getArrayEq, getMonoid } from './Array';
import { fromEquals } from './Eq';
import { identity } from './function';
import { pipeable } from './pipeable';
/**
 * @since 2.0.0
 */
export var URI = 'Tree';
/**
 * @since 2.0.0
 */
export function make(value, forest) {
    if (forest === void 0) { forest = empty; }
    return {
        value: value,
        forest: forest
    };
}
/**
 * @since 2.0.0
 */
export function getShow(S) {
    var show = function (t) {
        return t.forest === empty || t.forest.length === 0
            ? "make(" + S.show(t.value) + ")"
            : "make(" + S.show(t.value) + ", [" + t.forest.map(show).join(', ') + "])";
    };
    return {
        show: show
    };
}
/**
 * @since 2.0.0
 */
export function getEq(E) {
    var SA;
    var R = fromEquals(function (x, y) { return E.equals(x.value, y.value) && SA.equals(x.forest, y.forest); });
    SA = getArrayEq(R);
    return R;
}
var draw = function (indentation, forest) {
    var r = '';
    var len = forest.length;
    var tree;
    for (var i = 0; i < len; i++) {
        tree = forest[i];
        var isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += draw(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
/**
 * Neat 2-dimensional drawing of a forest
 *
 * @since 2.0.0
 */
export function drawForest(forest) {
    return draw('\n', forest);
}
/**
 * Neat 2-dimensional drawing of a tree
 *
 * @example
 * import { make, drawTree, tree } from 'fp-ts/lib/Tree'
 *
 * const fa = make('a', [
 *   tree.of('b'),
 *   tree.of('c'),
 *   make('d', [tree.of('e'), tree.of('f')])
 * ])
 *
 * assert.strictEqual(drawTree(fa), `a
 * ├─ b
 * ├─ c
 * └─ d
 *    ├─ e
 *    └─ f`)
 *
 *
 * @since 2.0.0
 */
export function drawTree(tree) {
    return tree.value + drawForest(tree.forest);
}
/**
 * Build a tree from a seed value
 *
 * @since 2.0.0
 */
export function unfoldTree(b, f) {
    var _a = f(b), a = _a[0], bs = _a[1];
    return { value: a, forest: unfoldForest(bs, f) };
}
/**
 * Build a tree from a seed value
 *
 * @since 2.0.0
 */
export function unfoldForest(bs, f) {
    return bs.map(function (b) { return unfoldTree(b, f); });
}
export function unfoldTreeM(M) {
    var unfoldForestMM = unfoldForestM(M);
    return function (b, f) { return M.chain(f(b), function (_a) {
        var a = _a[0], bs = _a[1];
        return M.chain(unfoldForestMM(bs, f), function (ts) { return M.of({ value: a, forest: ts }); });
    }); };
}
export function unfoldForestM(M) {
    var traverseM = array.traverse(M);
    return function (bs, f) { return traverseM(bs, function (b) { return unfoldTreeM(M)(b, f); }); };
}
/**
 * @since 2.0.0
 */
export function elem(E) {
    var go = function (a, fa) {
        if (E.equals(a, fa.value)) {
            return true;
        }
        return fa.forest.some(function (tree) { return go(a, tree); });
    };
    return go;
}
/**
 * Fold a tree into a "summary" value in depth-first order.
 *
 * For each node in the tree, apply `f` to the `value` and the result of applying `f` to each `forest`.
 *
 * This is also known as the catamorphism on trees.
 *
 * @example
 * import { fold, make } from 'fp-ts/lib/Tree'
 *
 * const t = make(1, [make(2), make(3)])
 *
 * const sum = (as: Array<number>) => as.reduce((a, acc) => a + acc, 0)
 *
 * // Sum the values in a tree:
 * assert.deepStrictEqual(fold((a: number, bs: Array<number>) => a + sum(bs))(t), 6)
 *
 * // Find the maximum value in the tree:
 * assert.deepStrictEqual(fold((a: number, bs: Array<number>) => bs.reduce((b, acc) => Math.max(b, acc), a))(t), 3)
 *
 * // Count the number of leaves in the tree:
 * assert.deepStrictEqual(fold((_: number, bs: Array<number>) => (bs.length === 0 ? 1 : sum(bs)))(t), 2)
 *
 * @since 2.6.0
 */
export function fold(f) {
    var go = function (tree) { return f(tree.value, tree.forest.map(go)); };
    return go;
}
/**
 * @since 2.0.0
 */
export var tree = {
    URI: URI,
    map: function (fa, f) { return ({
        value: f(fa.value),
        forest: fa.forest.map(function (t) { return tree.map(t, f); })
    }); },
    of: function (a) { return ({
        value: a,
        forest: empty
    }); },
    ap: function (fab, fa) { return tree.chain(fab, function (f) { return tree.map(fa, f); }); },
    chain: function (fa, f) {
        var _a = f(fa.value), value = _a.value, forest = _a.forest;
        var concat = getMonoid().concat;
        return {
            value: value,
            forest: concat(forest, fa.forest.map(function (t) { return tree.chain(t, f); }))
        };
    },
    reduce: function (fa, b, f) {
        var r = f(b, fa.value);
        var len = fa.forest.length;
        for (var i = 0; i < len; i++) {
            r = tree.reduce(fa.forest[i], r, f);
        }
        return r;
    },
    foldMap: function (M) { return function (fa, f) { return tree.reduce(fa, M.empty, function (acc, a) { return M.concat(acc, f(a)); }); }; },
    reduceRight: function (fa, b, f) {
        var r = b;
        var len = fa.forest.length;
        for (var i = len - 1; i >= 0; i--) {
            r = tree.reduceRight(fa.forest[i], r, f);
        }
        return f(fa.value, r);
    },
    traverse: function (F) {
        var traverseF = array.traverse(F);
        var r = function (ta, f) {
            return F.ap(F.map(f(ta.value), function (value) { return function (forest) { return ({
                value: value,
                forest: forest
            }); }; }), traverseF(ta.forest, function (t) { return r(t, f); }));
        };
        return r;
    },
    sequence: function (F) {
        var traverseF = tree.traverse(F);
        return function (ta) { return traverseF(ta, identity); };
    },
    extract: function (wa) { return wa.value; },
    extend: function (wa, f) { return ({
        value: f(wa),
        forest: wa.forest.map(function (t) { return tree.extend(t, f); })
    }); }
};
var pipeables = /*@__PURE__*/ pipeable(tree);
var ap = /*@__PURE__*/ (function () { return pipeables.ap; })();
var apFirst = /*@__PURE__*/ (function () { return pipeables.apFirst; })();
var apSecond = /*@__PURE__*/ (function () { return pipeables.apSecond; })();
var chain = /*@__PURE__*/ (function () { return pipeables.chain; })();
var chainFirst = /*@__PURE__*/ (function () { return pipeables.chainFirst; })();
var duplicate = /*@__PURE__*/ (function () { return pipeables.duplicate; })();
var extend = /*@__PURE__*/ (function () { return pipeables.extend; })();
var flatten = /*@__PURE__*/ (function () { return pipeables.flatten; })();
var foldMap = /*@__PURE__*/ (function () { return pipeables.foldMap; })();
var map = /*@__PURE__*/ (function () { return pipeables.map; })();
var reduce = /*@__PURE__*/ (function () { return pipeables.reduce; })();
var reduceRight = /*@__PURE__*/ (function () { return pipeables.reduceRight; })();
export { 
/**
 * @since 2.0.0
 */
ap, 
/**
 * @since 2.0.0
 */
apFirst, 
/**
 * @since 2.0.0
 */
apSecond, 
/**
 * @since 2.0.0
 */
chain, 
/**
 * @since 2.0.0
 */
chainFirst, 
/**
 * @since 2.0.0
 */
duplicate, 
/**
 * @since 2.0.0
 */
extend, 
/**
 * @since 2.0.0
 */
flatten, 
/**
 * @since 2.0.0
 */
foldMap, 
/**
 * @since 2.0.0
 */
map, 
/**
 * @since 2.0.0
 */
reduce, 
/**
 * @since 2.0.0
 */
reduceRight };
