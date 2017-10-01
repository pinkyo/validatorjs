import test from 'ava';
import _ from 'lodash';
import createValidator from '../src/createValidator';

const id = 'test.id';
const group = 'test.group';
const invalidGroup = "test.group.invalid";
const groups = [group];
const name = 'test.name';
const getter =() => 5;
const tip = 'value must less than 5.';
const validationChain = [({name, getter}) => getter() < 5? '': tip];
const field = {id, groups, getter, name};

test.beforeEach(t => {
  t.context.validator = createValidator();
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
