import test from 'ava';
import {
  equalTo,
  notEqualTo,
} from '../src/object';

const name = 'test.name';
const int = 5;
const intData = {name, value: int};

test('is equal to 5', t => {
  const result = equalTo(5)(intData);
  t.falsy(result);
});

test('false to be equal to 0', t => {
  const result = equalTo(0)(intData);
  t.truthy(result);
});

test('is not equal to 0', t => {
  const result = notEqualTo(0)(intData);
  t.falsy(result);
});

test('false to be not equal to 5', t => {
  const result = notEqualTo(5)(intData);
  t.truthy(result);
});
