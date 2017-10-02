import test from 'ava';
import _ from 'lodash';
import {
  isNum,
  isInteger,
  isFinite,
  greaterThan,
  notGreaterThan,
  equalTo,
  notEqualTo,
  lessThan,
  notLessThan
} from '../src/number';

const name = 'test.name';
const int = 5;
const float = 0.5;
const string = 'test';
const intData = {name, value: int};
const floatData = {name, value: float};
const inFiniteData = {name, value: Number.POSITIVE_INFINITY};
const stringField = {name, value: string};

test('is number', t => {
  const result = isNum()(intData);
  t.falsy(result);
});

test('false to be number', t => {
  const result = isNum()(stringField);
  t.truthy(result);
});

test('is integer', t => {
  const result = isInteger()(intData);
  t.falsy(result);
});

test('false to be integer', t => {
  const result = isInteger()(floatData);
  t.truthy(result);
});

test('is finite number', t => {
  const result = isFinite()(floatData);
  t.falsy(result);
});

test('false to be finite number', t => {
  const result = isFinite()(inFiniteData);
  t.truthy(result);
});

test('is greater than 3', t => {
  const result = greaterThan(3)(intData);
  t.falsy(result);
});

test('false to be greater than 10', t => {
  const result = greaterThan(10)(intData);
  t.truthy(result);
});
