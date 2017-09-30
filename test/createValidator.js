import test from 'ava';
import createValidator from '../src/createValidator';

test.beforeEach(t => {
    t.context.validator = createValidator();
});

test("create validator success.", t => {
    const {validator} = t.context;
    t.truthy(validator);
});


test("register validator success.", t => {
    const {validator} = t.context;
    const result = validator.register({id: "test.id", getter: () => 0}, null, () => {
        t.pass();
    });

    t.true(result);
});
