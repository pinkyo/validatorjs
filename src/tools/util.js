import _ from 'lodash';

function checkOneResult(oneResult) {
  if (_.isNil(oneResult)) { return; }

  const errorMessage = 'validateOne result has type error.';
  if (!_.isArray(oneResult)) {
    throw new TypeError(errorMessage);
  }
}

function checkResults(results) {
  if (!_.isObject(results)) {
    throw new TypeError('validate result has type error.');
  }
}

/**
* check if validateOne is falsy.
* @param {Array} validateOneRes
*/
export function oneFalsy(validateOneRes) {
  checkOneResult(validateOneRes);

  let result = true;
  _.each(validateOneRes, item => {
    if (!item) return;
    result = false;
  });
  return result;
}

/**
* all field validation result is falsy.
* @param {Object} validateRes
*/
export function allFalsy(validateRes) {
  checkResults(validateRes);

  let result = true;
  _.each(validateRes, value => {
    checkOneResult(value);
    if (oneFalsy(value)) return;
    result = false;
  });

  return result;
}

/**
 * check if validateOneRes is truthy.
 * @param {Object} validateOneRes
 */
export function oneTruthy(validateOneRes) {
  checkOneResult(validateOneRes);

  let result = true;
  _.each(validateOneRes, item => {
    if (item) return;
    result = false;
  });
  return result;
}

/**
 * check if all validate result is truthy.
 * @param {Object} validateRes
 */
export function allTruthy(validateRes) {
  checkResults(validateRes);

  let result = true;
  _.each(validateRes, value => {
    checkOneResult(value);
    if (oneTruthy(value)) return;
    result = false;
  });

  return result;
}
