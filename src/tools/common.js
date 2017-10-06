import _ from 'lodash';

/**
 * for inner use, check if num is number.
 * @param {Number} num
 */
export function checkNum(num) {
  if (_.isNumber(num)) return;
  throw new TypeError(`${num} is not a number.`);
}

export function checkString(string) {
  if (_.isString(string)) return;
  throw new TypeError(`${string} is not a string.`);
}
