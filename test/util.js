import test from 'ava';
import _ from 'lodash';
import {onePassed, allPassed} from '../src/util';

test('throw exception for validateOne result type error', t => {
    const typeError = t.throws(() => onePassed(1), TypeError);
    t.truthy(typeError);
});

test('throw exception for validate result type error', t => {
    const typeError = t.throws(() => allPassed(1), typeError);
    t.truthy(typeError);
});

test('throw exception for element of validator result type error', t => {
    const typeError = t.throws(() => allPassed([1, 2, 3], typeError));
    t.truthy(typeError);
});
