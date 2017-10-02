import _ from 'lodash';

function getName(name, id) {
  if (_.isNil(name)) return id;
  return name;
}

function checkFieldType(field) {
  const errorMessage ="field can't be null and must be an object.";
  if (!_.isObject(field)) {
    throw new TypeError(errorMessage);
  }
}

function checkId(id) {
  const errorMessage = "id must not be null and must be a string.";
  if (!_.isString(id)) {
    throw new TypeError(errorMessage);
  }
}

function checkGetter(getter) {
  const errorMessage = "getter must a function without paramter.";
  if (!_.isFunction(getter)) {
    throw new TypeError(errorMessage);
  }
}

function checkName(name) {
  if (_.isNil(name)) { return; }

  const errorMessage = "name must be a string."
  if (!_.isString(name)) {
    throw new TypeError(errorMessage);
  }
}

function checkGroups(groups) {
  if (_.isNil(groups)) { return; }

  const errorMessage = "groups must be an array of strings.";
  if (!_.isArray(groups)) {
    throw new TypeError(errorMessage);
  }

  groups.forEach(function(element) {
    if (!_.isString(element)) {
      throw new TypeError(errorMessage);
    }
  }, this);
}

function checkValidationChain(validationChain) {
  if (_.isNil(validationChain)) { return; }
  const errorMessage = "validation chain must be array of functions.";
  if (!_.isArray(validationChain)) {
    throw new TypeError(errorMessage);
  }
}

function checkCallback(callback) {
  if (_.isNil(callback)) { return; }

  const errorMessage = "callback must be a function.";
  if (!_.isFunction(callback)) {
    throw new TypeError(errorMessage);
  }
}

function checkListener(listener) {
  if (_.isNil(listener)) { return; }

  const errorMessage = "listener must be a function with a parameter."
  if (!_.isFunction(listener)) {
    throw new TypeError(errorMessage);
  }
}

function warnWhenNotRegistered(id, validationStorage) {
  if (_.isNil(validationStorage[id])) {
    console.warn(`id(${id}) haven't be registered, check it before subscribe.`);
    return false;
  }
}

function warnWhenIdNotInGroup(id, groupName, groupStroage) {
  const group = groupStroage[groupName];
  if (_.isNil(group) || !group[id]) {
    console.warn(`id(${id}) is not in group(${groupName})`);
  }
}

function warnWhenIdHaveRegister(id, validationStorage) {
  if (_.isNil(validationStorage[id])) return;
  console.warn(`id(${id}} have been registered.
    remember to deregister it before register again.`);
}

/**
* register field to validator.
* @param {Object} validator inner object
* @param {Object} field field info, include id, name, groups, getter
* @param {Array} validationChain validation chain is array of validation function with a parameter
* @param {Function} callback callback function
*/
function register(validator, field, validationChain, callback) {
  checkFieldType(field);

  const {id, getter, groups, name} = field;
  checkId(id);
  checkGetter(getter);
  checkName(name);
  checkGroups(groups);
  checkValidationChain(validationChain);
  checkCallback(callback);

  const {validationStorage, groupStroage} = validator;
  warnWhenIdHaveRegister(id, validationStorage);
  if (!_.isNil(validationStorage[id])) { return; }

  validationStorage[id] = {name, validationChain, getter};
  if (!_.isNil(groups)) {
    groups.forEach(function(element) {
      let group = groupStroage[element];
      if (!group) {
        groupStroage[element] = {};
        group = groupStroage[element];
      }

      group[id] = true;
    }, this);
  }

  if (!_.isNil(callback)) callback();
  return true;
}

/**
* validate all fields in groups. if groups is null, validate all fields.
* @param {Object} validator inner object
* @param {Array<String>} groups groups to validate.
* @param {Function} callback callback function.
*/
function validate(validator, groups, callback) {
  checkGroups(groups);
  checkCallback(callback);

  const {validationStorage, groupStroage} = validator;

  //fieldIds is ids to validate.
  let fieldIds = null;
  if (_.isNil(groups)) {
    fieldIds = _.keys(validationStorage);
  } else {
    const fieldIdSet = new Set()
    _.each(groups, (element) => {
      const group = groupStroage[element] || {};
      for (const id in group)
      if (group[id]) fieldIdSet.add(id);
    });

    fieldIds = _.toArray(fieldIdSet);
  }

  const result = {};
  _.each(fieldIds, (element) => {
    const validationResult = validateOne(validator, element, null);
    result[element] = validationResult;
  });

  if (!_.isNil(callback)) callback();
  return result;
}

/**
 * validate one field.
 * @param {Object} validator inner object
 * @param {String} id field id
 * @param {Function} callback callback function.
 */
function validateOne(validator, id, callback) {
  checkId(id);
  checkCallback(callback);

  const {validationStorage} = validator;
  const validation = validationStorage[id];
  warnWhenNotRegistered(id, validationStorage);

  // exit when id has not been registered.
  if (_.isNil(validation)) { return; }

  const {name, getter, validationChain, listeners = []} = validation;

  const validationResult = [];
  if (!_.isNil(validationChain)) {
    _.each(validationChain, (f) => {
      validationResult.push(f({name: getName(name, id), value: getter()}));
    });
  }

  _.each(listeners, (f) => {
    f(validationResult);
  });

  if (!_.isNil(callback)) callback();

  return validationResult;
}

/**
* subscribe a listener, return unsubscribe function.
* @param {Object} validator inner object
* @param {String} id field id
* @param {Function} listener listener function
* @param {Function} callback callback function
*/
function subscribe(validator, id, listener, callback) {
  checkListener(listener);
  checkCallback(callback);

  if (_.isNil(listener)) { return true; }

  const {validationStorage} = validator;
  warnWhenNotRegistered(id, validationStorage);

  const validation = validationStorage[id];
  const {listeners = []} = validation;
  listeners.push(listener)
  validation.listeners = listeners;

  if (!_.isNil(callback)) callback();
  return () => {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
    validation.listeners = listeners;
    return true;
  };
}

/**
 * clear all listener of one field.
 * @param {Object} validator inner object
 * @param {String} id field id
 * @param {Function} callback callback function
 */
function clearListeners(validator, id, callback) {
  checkId(id);
  checkCallback(callback);

  const {validationStorage} = validator;
  warnWhenNotRegistered(id, validationStorage);

  const validation = validationStorage[id];
  if (_.isNil(validation)) { return; }

  validation.listeners = [];
  if (!_.isNil(callback)) callback();
}

/**
* update group info.
* @param {Object} validator inner object
* @param {String} id field id
* @param {Array<String>} groups new groups
* @param {Function} callback callback function
*/
function updateGroups(validator, id, groups, callback) {
  checkGroups(groups);
  checkCallback(callback);

  const {groupStroage, validationStorage} = validator;
  warnWhenNotRegistered(id ,validationStorage);

  //remove all groups.
  _.values(groupStroage).forEach(function(element) {
    element[id] = false;
  }, this);

  groups.forEach(function(element) {
    let group = groupStroage[element];
    if (!group) {
      group = {};
      groupStroage[element] = group;
    }
    group[id] = true;
  }, this);

  if (!_.isNil(callback)) callback();
  return true;
}

/**
*
* add group to a field.
* @param {Object} validator inner
* @param {String} id field id
* @param {String} group group name
* @param {Function} callback callback function
*/
function addGroup(validator, id, group, callback) {
  checkGroups([group]);
  checkCallback(callback);

  const {groupStroage, validationStorage}  = validator;
  warnWhenNotRegistered(id, validationStorage);

  let groupInfo = groupStroage[group];
  if (!groupInfo) {
    groupInfo = {};
    groupStroage[group] = groupInfo;
  }
  groupInfo[id] = true;

  if (!_.isNil(callback)) callback();
  return true;
}

/**
* remove group from a field.
* @param {Object} validator inner object
* @param {String} id field id
* @param {String} group group name
* @param {Function} callback callback function
*/
function removeGroup(validator, id, group, callback) {
  checkGroups([group]);
  checkCallback(callback);

  const {groupStroage, validationStorage} = validator;
  warnWhenNotRegistered(id, validationStorage);
  if (_.isNil(validationStorage[id])) { return; }

  const groupInfo = groupStroage[group];
  warnWhenIdNotInGroup(id, group, groupStroage);
  if (_.isNil(groupInfo)) { return; }

  groupInfo[id] = false;

  if (!_.isNil(callback)) callback();
}

/**
 * deregeister a field from validator.
 * @param {Object} validator inner object
 * @param {String} id field id
 * @param {Function} callback callback function
 */
function deregister(validator, id, callback) {
  checkId(id);
  checkCallback(callback);

  const {validationStorage, groupStroage} = validator;
  const validation = validationStorage[id];

  warnWhenNotRegistered(id, validationStorage);
  if (_.isNil(validation)) { return; }

  delete validationStorage[id];
  if (!_.isNil(callback)) callback()
}

/**
 *
 * @param {Object} validator inner object
 */
function printValidationInfo(validator) {
  const {validationStorage} = validator;
  const validationToPrint = [];
  _.each(validationStorage, (value, id) => {
    validationToPrint.push({...value, id});
  });

  console.info("============== VALIDATION INFO ==============")
  console.info(validationToPrint);
  console.info("==============================================")
}

/**
 *
 * @param {Object} validator inner object
 */
function printGroupInfo(validator) {
  const {groupStroage} = validator;
  const groupToPrint = {};
  _.each(groupStroage, (idMap, groupName) => {
    groupToPrint[groupName] = _.filter(_.keys(idMap), id => idMap[id]);
  });

  console.info("================= GROUP INFO =================")
  console.info(groupToPrint);
  console.info("==============================================")
}

/**
 * create a central validator.
 */
function createValidator() {
  const validationStorage = {};
  const groupStroage = {};
  const validator = {
    validationStorage,
    groupStroage
  };

  const operation = {
    register: register.bind(this, validator),
    validate: validate.bind(this, validator),
    validateOne: validateOne.bind(this, validator),
    subscribe: subscribe.bind(this, validator),
    clearListeners: clearListeners.bind(this, validator),
    updateGroups: updateGroups.bind(this, validator),
    addGroup: addGroup.bind(this, validator),
    removeGroup: removeGroup.bind(this, validator),
    deregister: deregister.bind(this, validator),
    printValidationInfo: printValidationInfo.bind(this, validator),
    printGroupInfo: printGroupInfo.bind(this, validator),
  };

  return operation;
}

export default createValidator;
