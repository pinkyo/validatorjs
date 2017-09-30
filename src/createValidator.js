import _ from 'lodash';

function checkFieldType(field) {
  const errorMessage ="field can't be null.";
  if (!field) {
    throw new Error(errorMessage);
  }
}

function checkId(id) {
  const errorMessage = "id must not be null and must be a string.";
  if (!id || !_.isString(id)) {
    throw new Error(errorMessage);
  }
}

function checkGetter(getter) {
  const errorMessage = "getter must a function without paramter.";
  if (!_.isFunction(getter)) {
    throw new Error(errorMessage);
  }
}

function checkName(name) {
  if (!name) { return; }
  
  const errorMessage = "name must be a string."
  if (!_.isString(name)) {
    throw new Error(errorMessage);
  }
}

function checkGroups(groups) {
  if (!groups) { return; }
  
  const errorMessage = "groups must be an array of strings.";    
  if (!_.isArray(groups)) {
    throw new Error(errorMessage);
  }
  
  groups.forEach(function(element) {
    if (!_.isString(element)) {
      throw new Error(errorMessage);
    }
  }, this);
}

function checkValidationChain(validationChain) {
  if (_.isNil(validationChain)) { return; }
  const errorMessage = "validation chain must be array of functions.";
  if (validationChain && !_.isArray(validationChain)) {
    throw new Error(errorMessage);
  }
}

function checkCallback(callback) {
  if (!callback) { return; }
  
  const errorMessage = "callback must be a function.";

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
  
  const {validationStorage, groupStroage} = validator;
  validationStorage[id] = {name, validationChain};
  if (groups) {
    groups.forEach(function(element) {
      let gtemp = groupStroage[element];
      if (!gtemp) {
        groupStroage[element] = {};
        gtemp = groupStroage[element];
      }
      
      gtemp[id] = true;
    }. this);
  }
  
  callback.call();
  return true;
}

/**
* 
* @param {* validator, inner object} validator 
* @param {* groups to be validated. if null, all field will be validated.} groups 
*/
function validate(validator, groups, callback) {
  checkGroups(groups);
  
  const {validationStorage, groupStroage} = validator;
  
  //fieldIds is ids to be validated.
  let fieldIds = new Set();
  if (groups) {
    groups.forEach(function(element) {
      const group = groupStroage[element] || {};
      for (id in group)
      if (group[id]) fieldIds.add(id); 
    }, this);
  } else {
    fieldIds = validationStorage.keys();
  }
  
  const result = {};
  fieldIds.forEach(function(element) {
    const validation = validationStorage[element];
    const {name, getter, validationChain, listeners} = validate;
    if (validationChain) {
      result[element] = validationChain.call({name, getter});
    } else {
      result[element] = null;
    }
    
    if (listeners) {
      listeners.forEach(function(f) {
        f.call(result[element]);
      }, this);
    }
  }, this);
  
  callback.call();
  return result;
}

function checkListener(listener) {
  if (!listener) { return; }
  
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
  if (!listener) { return true; }
  
  const {validationStorage} = validator;
  const validation = validationStorage[id];
  if (!validation) {
    console.warn(`id ${id} haven't be registered, check it before subscribe.`);
    return false;
  }
  
  const {listeners = []} = validation;
  validation.listeners = listeners.push(listener);
  
  callback.call();
  return function() {
    const index = listeners.indexOf(listener);
    validation.listeners = listeners.splice(index, 1);
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
  
  const {groupStroage} = validator;
  
  //remove all groups.
  groupStroage.forEach(function(element) {
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
  
  callback.call();
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
  
  const { groupStroage }  = validator;
  let groupInfo = groupStroage[group];
  if (!groupInfo) {
    groupInfo = {};
    groupStroage[group] = groupInfo;
  }
  groupInfo[id] = true;
  
  callback.call();
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
  
  const { groupStroage } = validator;
  const groupInfo = groupStroage[group];
  if (!groupInfo) { return true; }
  
  groupInfo[id] = true;
  callback.call();
  
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