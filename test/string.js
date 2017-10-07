import test from 'ava';
import {lenBetween, lenGT, lenLT} from '../src/tools/string';

const name = 'test.name';
const stringValue = 'test';
const stringField = {name, value: stringValue};

test('length is between 4 and 4', t => {
  const result = lenBetween(4, 4)(stringField);
  t.falsy(result);
});

test('length is between 1 and 2', t => {
  const result = lenBetween(1, 2)(stringField);
  t.truthy(result);
});

test('throw Exception when lenBetween parameters are not legal', t => {
  const error = t.throws(() => lenBetween(2, 1)(stringField), Error);
  t.truthy(error);
});

test('length is greater than 3', t => {
  const result = lenGT(3)(stringField);
  t.falsy(result);
});

test('length is greater than 5', t => {
  const result = lenGT(5)(stringField);
  t.truthy(result);
});

test('throw exception when lenGT paramemter is illegal', t => {
  const error = t.throws(() => lenGT(-1)(stringField), Error);
  t.truthy(error);
});

test('length is less than 5', t => {
  const result = lenLT(5)(stringField);
  t.falsy(result);
});

test('length is less than 3', t => {
  const result = lenLT(3)(stringField);
  t.truthy(result);
});

test('throw exception when lenLT parameter is illegal', t => {
  const error = t.throws(() => lenLT(-1)(stringField), Error);
  t.truthy(error);
});
