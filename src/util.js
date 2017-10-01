import _ from 'lodash';

function checkOneResult(oneResult) {
    if (_.isNil(oneResult)) { return; }

    const errorMessage = 'validateOne result has type error.';
    if (!_.isArray(oneResult)) {
        throw new TypeError(errorMessage);
    }
}

/**
 * check if validateOne is falsy.
 * @param {Array} validateOneRes 
 */
export function onePassed(validateOneRes) {
    checkOneResult(validateOneRes);

    let result = true;
    _.each(validateOneRes, item => {
      if (!item) return;
      result = false;
    });
    return result;
}

/**
 * all field validation result is falsy;
 * @param {Object} validateRes 
 */
export function allPassed(validateRes) {
    if (!_.isObject(validateRes)) {
        throw new TypeError('validate result has type error.')
    }

    let result = true;
    _.each(validateRes, value => {
        checkOneResult();
        if (onePassed(value)) return;
        result = false;
    });

    return result;
}
