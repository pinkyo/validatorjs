import {checkNum, checkString} from './common';

/**
* check if a string's length is between low and high.
* @param {Number} low
* @param {Number} high
*/
export function lenBetween(low, high) {
  checkNum(low);
  checkNum(high);
  if (low < 0 || low > high) {
    throw new Error(`low: ${low}, high: ${high}, invalid paramters.`);
  }

  return ({name, value}) => {
    checkString(value);
    const length = value.length;
    if (length >= low && length <= high) return;
    return `${name}'s length must between ${low} and ${high}`;
  };
}

export function lenGT(val) {
  checkNum(val);
  if (val < 0) {
    throw new Error(`val: ${val}, invalid parameters.`);
  }

  return ({name, value}) => {
    checkString(value);
    if (value.length > val) return;
    return `${name}'s length must be greater than ${val}`;
  };
}

export function lenLT(val) {
  checkNum(val);
  if (val < 0) {
    throw new Error(`val: ${val}, invalid parameters.`);
  }

  return ({name, value}) => {
    checkString(value);
    if (value.length < val) return;
    return `${name}'s length must be less than ${val}`;
  };
}
