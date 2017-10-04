import test from 'ava';
import _ from 'lodash';
import sinon from 'sinon';
import createValidator from '../src/createValidator';

const id = 'test.id';
const group = 'test.group';
const invalidGroup = 'test.group.invalid';
const groups = [group];
const name = 'test.name';
const getter =() => 5;
const tip = 'value must less than 5.';
const validationChain = [({value}) => value < 5? '': tip];
const field = {id, groups, getter, name};

test.beforeEach(t => {
  t.context.warn = sinon.spy(global.console, 'warn');
  t.context.info = sinon.spy(global.console, 'info');
  t.context.validator = createValidator();
});

test.afterEach.always(t => {
  const {info, warn} = t.context;
  info.restore();
  warn.restore();
});

test('create validator success.', t => {
  const {validator} = t.context;
  t.truthy(validator);
});

test('register validator success.', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  const result = validator.register({id: 'test.id', getter: () => 0}, null, () => {
    callbackInvoked = true;
  });

  t.true(callbackInvoked);
  t.true(result);
});

test('validate with group success.', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  validator.register(field, validationChain);
  const result = validator.validate([group, invalidGroup], () => {
    callbackInvoked = true;
  });

  t.true(callbackInvoked);
  t.deepEqual(result[id], [tip]);
});

test('validate without group success.', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  validator.register(field, validationChain);
  const result = validator.validate(null, () => {
    callbackInvoked = true;
  });

  t.true(callbackInvoked);
  t.deepEqual(result[id], [tip]);
});

test('validateOne success', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  validator.register(field, validationChain);
  const result = validator.validateOne(id, () => {
    callbackInvoked = true;
  });

  t.true(callbackInvoked);
  t.deepEqual(result, [tip]);
});

test('subscribe success', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  let listenerRes = null;
  validator.register(field, validationChain);
  const unsubscribe = validator.subscribe(id, (res) => {
    listenerRes = res;
  }, () => {
    callbackInvoked = true;
  });
  validator.validate();

  t.true(_.isFunction(unsubscribe));
  t.true(callbackInvoked);
  t.deepEqual(listenerRes, [tip]);
});

test('suscribe fail with null listener', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  validator.register(field, validationChain);
  const unsubscribe = validator.subscribe(id, null, () => {
    callbackInvoked = true;
  });
  validator.validate();

  t.false(_.isFunction(unsubscribe));
  t.false(callbackInvoked);
});

test('unsubscribe success', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  let listenerRes = null;
  validator.register(field, validationChain);
  const unsubscribe = validator.subscribe(id, (res) => {
    listenerRes = res;
  }, () => {
    callbackInvoked = true;
  });
  unsubscribe();
  validator.validate();

  t.true(callbackInvoked);
  t.deepEqual(listenerRes, null);
});

test('clear all listener success', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  let listenerRes = null;
  validator.register(field, validationChain);
  validator.subscribe(id, (res) => {
    listenerRes = res;
  });
  validator.clearListeners(id, () => {
    callbackInvoked = true;
  });
  validator.validate();

  t.true(callbackInvoked);
  t.deepEqual(listenerRes, null);
});

test('add group success', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  validator.register(field, validationChain);
  validator.addGroup(id, invalidGroup, () => {
    callbackInvoked = true;
  });
  const result = validator.validate([invalidGroup]);

  t.true(callbackInvoked);
  t.deepEqual(result[id], [tip]);
});

test('remove group success', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  validator.register(field, validationChain);
  validator.removeGroup(id, group, () => {
    callbackInvoked = true;
  });
  const result = validator.validate(groups);

  t.true(callbackInvoked);
  t.deepEqual(result[id], undefined);
});

test('upate group success', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  validator.register(field, validationChain);
  validator.updateGroups(id, [invalidGroup], () => {
    callbackInvoked = true;
  });
  const result = validator.validate([invalidGroup]);

  t.true(callbackInvoked);
  t.deepEqual(result[id], [tip]);
});

test('deregister success', t => {
  const {validator} = t.context;
  let callbackInvoked = false;
  validator.register(field, validationChain);
  validator.deregister(id, () => {
    callbackInvoked = true;
  });
  const result = validator.validate();

  t.true(callbackInvoked);
  t.deepEqual(result[id], undefined);
});


test('throw exception for field type error', t => {
  const {validator} = t.context;
  const fieldError = t.throws(
    () => validator.register(null, validationChain),
    TypeError);
  t.truthy(fieldError);
});

test('throw exception for id type error', t => {
  const {validator} = t.context;
  const idError = t.throws(
    () => validator.register(
      {id: 1, getter, name},
      validationChain),
    TypeError);
  t.truthy(idError);
});

test('throw exception for name type error', t => {
  const {validator} = t.context;
  const nameError = t.throws(
    () => validator.register(
      {id, getter, name: 1},
      validationChain),
    TypeError);
  t.truthy(nameError);
});

test('throw exception for groups type error', t => {
  const {validator} = t.context;
  const groupError = t.throws(
    () => validator.register(
      {id, getter, name, groups: 1},
      validationChain),
    TypeError);
  t.truthy(groupError);
});

test('throw exception for elements of groups type error', t => {
  const {validator} = t.context;
  const groupError = t.throws(
    () => validator.register(
      {id, getter, name, groups: [1, 2, 3]},
      validationChain),
    TypeError);
  t.truthy(groupError);
});

test('throw exception for getter type error', t => {
  const {validator} = t.context;
  const getterError = t.throws(
    () => validator.register(
      {id, getter: 1, name},
      validationChain),
    TypeError);
  t.truthy(getterError);
});

test('throw exception for validation function chain type error', t => {
  const {validator} = t.context;
  const chainError = t.throws(
    () => validator.register(
      field, 1),
    TypeError);
  t.truthy(chainError);
});

test('throw exception for callback function type error', t => {
  const {validator} = t.context;
  const callbackError = t.throws(
    () => validator.register(
      field, validationChain, 1),
    TypeError);
  t.truthy(callbackError);
});

test('throw exception for listener function type error', t => {
  const {validator} = t.context;
  const listenerError = t.throws(
    () => validator.subscribe(id, 1),
    TypeError);
  t.truthy(listenerError);
});

test('show warn when id has not been registered', t => {
  const {validator, warn} = t.context;
  warn.reset();
  validator.removeGroup(id, invalidGroup);

  t.true(warn.calledOnce);
});

test('show warn when id is not in group', t => {
  const {validator, warn} = t.context;
  warn.reset();
  validator.register(field, validationChain);
  validator.removeGroup(id, invalidGroup);

  t.true(warn.calledOnce);
});

test('show validation info', t => {
  const {validator, info} = t.context;
  info.reset();
  validator.register(field, validationChain);
  validator.printValidationInfo();

  t.true(info.called);
});

test('show group info', t => {
  const {validator, info} = t.context;
  info.reset();
  validator.register(field, validationChain);
  validator.printGroupInfo();

  t.true(info.called);
});

test('show all info', t => {
  const {validator, info} = t.context;
  info.reset();
  validator.register(field, validationChain);
  validator.printAllInfo();

  t.true(info.calledOnce);
});
