import _ from 'lodash';

/**
 * return a validation function to check if value is
 * equal to constant after run.
 * @param {Object} constant constant to compare
 */
export function equalTo(constant) {
  return ({value, name}) => {
    if (_.isEqual(value, constant)) return;
    return `${name} must be equal to ${constant}.`;
  };
}

/**
   * return a validation function to check if value is
   * not equal to constant after run.
   * @param {Object} constant constant to compare
   */
export function notEqualTo(constant) {
  return ({value, name}) => {
    if (!_.isEqual(value, constant)) return;
    return `${name} must not be equal to ${constant}.`;
  };
}
