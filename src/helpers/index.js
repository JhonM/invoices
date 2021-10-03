import * as R from "ramda";

/**
 * @param {Array} arr
 * @param {Function} predicate
 * @returns {Number}
 */
export function total(arr, predicate) {
  return R.pipe(R.map(predicate), R.sum)(arr);
}
