import _ from 'lodash';

function checkNum(num) {
  if (!_.isNumber(num))
    throw new TypeError(`${num} is not a number.`);
}


/**
 * return a validation function to check value is a
 * number after run.
 */
export function isNum() {
  return ({value, name}) => {
    if (_.isNumber(value)) return;
    return `${name} must be a number.`;
  }
}

/**
 * return a validation function to check value is a
 * integer after run.
 */
export function isInteger() {
  return ({value, name}) => {
    if (_.isInteger(value)) return;
    return `${name} must be an integer.`
  };
}

/**
 * return a validation function to check value is a
 * fininte number after run.
 */
export function isFinite() {
  return ({value, name}) => {
    if (_.isFinite(value)) return;
    return `${name} must be a float.`
  }
}

/**
 * return a validation function to check if value is
 * greater than num after run.
 * @param {Number} num number to compare
 */
export function greaterThan(num) {
  checkNum(num);
  return ({value, name}) => {
    checkNum(value);
    if (value > num) return;
    return `${name} must be greater than ${num}.`;
  };
}

/**
 * return a validation function to check if value is
 * not greater than num after run.
 * @param {Number} num number to compare
 */
export function notGreaterThan(num) {
  checkNum(num);
  return ({value, name}) => {
    checkNum(value);
    if (value <= num) return;
    return `${name} must not be greater than ${num}.`;
  }
}

/**
 * return a validation function to check if value is
 * equal to num after run.
 * @param {Number} num number to compare
 */
export function equalTo(num) {
  checkNum(num);
  return ({value, name}) => {
    checkNum(value);
    if (_.isEqual(value, num)) return;
    return `${name} must be equal to ${num}.`;
  }
}

/**
 * return a validation function to check if value is
 * not equal to num after run.
 * @param {Number} num number to compare
 */
export function notEqualTo(num) {
  checkNum(num);
  return ({value, name}) => {
    checkNum(value);
    if (!_.isEqual(value, num)) return;
    return `${name} must not be equal to ${num}.`;
  }
}

/**
 * return a validation function to check if value is
 * less than num after run.
 * @param {Number} num number to compare
 */
export function lessThan(num) {
  checkNum(num);
  return ({value, name}) => {
    checkNum(value);
    if (value < num) return;
    return `${name} must be less than ${num}.`;
  }
}

/**
 * return a validation function to check if value is
 * not less than num after run.
 * @param {Number} num number to compare
 */
export function notLessThan(num) {
  checkNum(num);
  return ({value, name}) => {
    checkNum(value);
    if (value >= num) return;
    return `${name} must not be less than ${num}.`;
  }
}
