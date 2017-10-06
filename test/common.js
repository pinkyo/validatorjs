import test from 'ava';
import {checkNum, checkString} from '../src/tools/common';

const num = 1;
const string = 'str';

test('is a number', t => {
  checkNum(num);
  t.pass();
});

test('throw exception when is not a number', t => {
  const typeError = t.throws(() => checkNum(string), TypeError);
  t.truthy(typeError);
});

test('is a string', t => {
  checkString(string);
  t.pass();
});

test('throw exception when is not a string', t => {
  const typeError = t.throws(() => checkString(num), TypeError);
  t.truthy(typeError);
});
