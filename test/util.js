import test from 'ava';
import {oneFalsy, allFalsy, oneTruthy, allTruthy} from '../src/tools/util';

const oneTruthyRes = ['test.name must greater than 3'];
const allTruthyRes = {'test.id': oneTruthyRes};
const oneFalsyRes = [null];
const allFalsyRes = {'test.id': oneFalsyRes};

test('one falsy', t => {
  const result = oneFalsy(oneFalsyRes);
  t.true(result);
});

test('not one falsy', t => {
  const result = oneFalsy(oneTruthyRes);
  t.false(result);
});

test('all falsy', t => {
  const result = allFalsy(allFalsyRes);
  t.true(result);
});

test('not all falsy', t => {
  const result = allFalsy(allTruthyRes);
  t.false(result);
});

test('one truthy', t => {
  const result = oneTruthy(oneTruthyRes);
  t.true(result);
});

test('not one truthy', t => {
  const result = oneTruthy(oneFalsyRes);
  t.false(result);
});

test('all truthy', t => {
  const result = allTruthy(allTruthyRes);
  t.true(result);
});

test('not all truthy', t => {
  const result = allTruthy(allFalsyRes);
  t.false(result);
});

test('throw exception for validateOne result type error', t => {
  const typeError = t.throws(() => oneFalsy(1), TypeError);
  t.truthy(typeError);
});

test('throw exception for validate result type error', t => {
  const typeError = t.throws(() => allFalsy(1), typeError);
  t.truthy(typeError);
});

test('throw exception for element of validator result type error', t => {
  const typeError = t.throws(() => allFalsy([1, 2, 3], typeError));
  t.truthy(typeError);
});
