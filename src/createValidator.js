import _ from 'lodash';
import * as operations from './operation';

function bindOperationsToValidator(operations, validator) {
  return _.mapValues(operations, operationFun => operationFun.bind(this, validator));
}
/**
 * create a central validator.
 */
function createValidator() {
  const validationStorage = {};
  const groupStroage = {};
  const resultCache = {};
  const validator = {
    validationStorage,
    groupStroage,
    resultCache
  };

  return bindOperationsToValidator(operations, validator);
}

export default createValidator;
