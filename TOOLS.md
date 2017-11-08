## Tools

tools is a directory that is not exported in index. there are some functions that may use commonly when work with **@pinkyo/validatorjs**.

files included now:
- string.js: some validation function about string.
- number.js: some validation function about number.
- object.js: some common validation function.
- util.js: some tool about validate result.

explore them as you like, and you can write your own tool function very easily.

## Example

~~~ javascript
import test from 'ava';
import _ from 'lodash';
import {lenBetween} from '@pinkyo/validatorjs/lib/tools/string';

const name = "test.name";
const stringValue = 'test';
const stringField = {name, value: stringValue};

test('length is between 4 and 4', t => {
  const result = lenBetween(4, 4)(stringField);
  t.falsy(result);
});
~~~

### How to customize the default error message.

~~~ javascript
import _ from 'lodash';
import {lenBetween} from '@pinkyo/validatorjs/lib/tools/string';

const customizedlenBetween = function({name, value}) {
  if (_.isNil(lenBetween(2, 3))) return;
  return 'customized string message.'
}
~~~
