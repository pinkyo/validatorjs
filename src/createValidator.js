import _ from 'lodash';

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

/**
* register field to validator.
* @param {* validator, inner object} validator
* @param {* field info, include id, name, groups, getter} field 
* @param {* validation chain is array of validation function with a parameter} validationChain 
* @param {* callback function} callback 
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
  validationStorage[id] = {name, validationChain, getter};
  if (groups) {
    groups.forEach(function(element) {
      let group = groupStroage[element];
      if (!group) {
        groupStroage[element] = {};
        group = groupStroage[element];
      }
      
      group[id] = true;
    }, this);
  }
  
  if (callback) callback();
  return true;
}

/**
* 
* @param {* validator, inner object} validator 
* @param {* groups to be validated. if null, all field will be validated.} groups 
*/
function validate(validator, groups, callback) {
  checkGroups(groups);
  checkCallback(callback);
  
  const {validationStorage, groupStroage} = validator;
  
  //fieldIds is ids to be validated.
  let fieldIds = new Set();
  if (groups) {
    groups.forEach(function(element) {
      const group = groupStroage[element] || {};
      for (const id in group)
      if (group[id]) fieldIds.add(id); 
    }, this);
  } else {
    fieldIds = _.keys(validationStorage);
  }
  
  const result = {};
  fieldIds.forEach(function(element) {
    const validation = validationStorage[element];
    const {name, getter, validationChain, listeners = []} = validation;
    
    const validationResult = [];
    if (!_.isNil(validationChain)) {
      _.each(validationChain, (f) => {
        validationResult.push(f({name, getter}));
      });
    }
    result[element] = validationResult;
    
    listeners.forEach(function(f) {
      f(validationResult);
    }, this);
  }, this);
  
  if (callback) callback();
  return result;
}

function checkListener(listener) {
  if (_.isNil(listener)) { return; }
  
  const errorMessage = "listener must be a function with a parameter."
  if (!_.isFunction(listener)) {
    throw new Error(errorMessage);
  }
}

/**
* subscribe a listener, return unsubscribe function.
* @param {* inner object} validator 
* @param {* field id} id 
* @param {* listener function} listener 
* @param {* callback function} callback 
*/
function subscribe(validator, id, listener, callback) {
  checkListener(listener);
  checkCallback(callback);
  
  if (_.isNil(listener)) { return true; }
  
  const {validationStorage} = validator;
  const validation = validationStorage[id];
  if (_.isNil(validation)) {
    console.warn(`id ${id} haven't be registered, check it before subscribe.`);
    return false;
  }
  
  const {listeners = []} = validation;
  listeners.push(listener)
  validation.listeners = listeners;
  
  if (callback) callback();
  return () => {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
    validation.listeners = listeners;
    return true;
  };
}

/**
* update group info.
* @param {* inner object} validator 
* @param {* field id} id 
* @param {* new groups} groups 
* @param {* callback when finished} callback 
*/
function updateGroups(validator, id, groups, callback) {
  checkGroups(groups);
  checkCallback(callback);
  
  const {groupStroage} = validator;
  
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
  
  if (callback) callback();
  return true;
}

/**
* 
* add group to a field.
* @param {* inner object} validator 
* @param {* field id} id 
* @param {* group name} group 
* @param {* callback function} callback 
*/
function addGroup(validator, id, group, callback) {
  checkGroups([group]);
  checkCallback(callback);
  
  const { groupStroage }  = validator;
  let groupInfo = groupStroage[group];
  if (!groupInfo) {
    groupInfo = {};
    groupStroage[group] = groupInfo;
  }
  groupInfo[id] = true;
  
  if (callback) callback();
  return true;
}

/**
* remove group from a field.
* @param {* inner object} validator 
* @param {* field id} id 
* @param {* group name} group 
* @param {* callback function} callback 
*/
function removeGroup(validator, id, group, callback) {
  checkGroups([group]);
  checkCallback(callback);
  
  const { groupStroage } = validator;
  const groupInfo = groupStroage[group];
  if (!groupInfo) { return true; }
  
  groupInfo[id] = false;

  if (callback) callback();
  return true;
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
    subscribe: subscribe.bind(this, validator),
    updateGroups: updateGroups.bind(this, validator),
    addGroup: addGroup.bind(this, validator),
    removeGroup: removeGroup.bind(this, validator)
  };
  
  return operation;
}

export default createValidator;
