import _ from 'lodash';
import {checkNum} from './common';

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
    const length = _.length(value);
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
    if (_.length(value) > val) return;
    return `${name}'s length must be greater than ${val}`;
  }
}

export function lenLT(val) {
  checkNum(val);
  if (val < 0) {
    throw new Error(`val: ${val}, invalid parameters.`);
  }

  return ({name, value}) => {
    if (_.length(value) < val) return;
    return `${name}'s length must be less than ${val}`;
  }
}