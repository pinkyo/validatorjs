import _ from 'lodash';

/**
 * for inner use, check if num is number.
 * @param {Number} num
 */
export function checkNum(num) {
  if (!_.isNumber(num))
  throw new TypeError(`${num} is not a number.`);
}
