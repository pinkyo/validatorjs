# validatorjs

[![Travis](https://img.shields.io/travis/pinkyo/validatorjs.svg)](https://travis-ci.org/pinkyo/validatorjs)
[![Coveralls](https://img.shields.io/coveralls/pinkyo/validatorjs.svg)](https://coveralls.io/github/pinkyo/validatorjs)
[![npm (scoped)](https://img.shields.io/npm/v/@pinkyo/validatorjs.svg)](https://www.npmjs.com/package/@pinkyo/validatorjs)
[![npm](https://img.shields.io/npm/dy/@pinkyo/validatorjs.svg)](https://www.npmjs.com/package/@pinkyo/validatorjs)
[![npm](https://img.shields.io/npm/l/@pinkyo/validatorjs.svg)](https://www.npmjs.com/package/@pinkyo/validatorjs)

validatorjs gives you nearly total control when you validate form values, compare to the existing validator tools. You can use it as a part to wrap the **\<input\>**, **\<textarea\>** and so on, with an error message display. although I try to emit convention usage, I can't get away from all and there are stil some convention usages.

### Usage

~~~ bash
$npm i @pinkyo/validatorjs -S
~~~

### Document

this module includs several simple concepts.
- `field`: field to validate, including id, name, groups, getter.
    - `id`: field id. `required`.
    - `name`: field name for error message display. `optional`. if not specified, id will be used.
    - `groups`: groups that field is in, it is used when check more than one field. `optional`. we can validate a group of fields a time, and all fields will be added to default group when registered.
    - `getter`: function to get field value, without no parameter. `required`.
- `validationChain`: an array of functions to validate the field value. The following is a validation example:

    ~~~ javascript
        ({name, value}) => {
            if (value < 10) return;
            return `${name} must less than 10`;
        }
    ~~~

- `listener`: function that will be invoked when validation is triggered.
- `resultCache`: after validation, result will be saved to a cache for future's operataion, like access.
### API

**create a validator**

A validator is the beginning of validatorjs usage, we operate on this object for the function we required.

~~~ javascript
function createValidator();
~~~

**register a field to validator**

~~~ javascript
function register(field, validationChain, callback);
~~~

**validate groups, if not specified, default group.** ***defalt group contains all fields.***

~~~ javascript
function validate(groups, callback);
~~~

**validate one field**

~~~ javascript
function validateOne(id, callback) {
~~~

**subscribe a listener**

~~~ javascript
function subscribe(id, listener, callback);
~~~

**clear all listen to a field**

~~~ javascript
function clearListeners(id, callback);
~~~

**update groups of a field**

~~~ javascript
function updateGroups(id, groups, callback);
~~~

**add a group to a field**

~~~ javascript
function addGroup(id, group, callback);
~~~

**remove a group to a field**

~~~ javascript
function removeGroup(id, group, callback);
~~~

**get one latest valiation result from result cache by id**

~~~ javascript
function getOneResult(id);
~~~

**get latest valiation results from result cache by groups**

~~~ javascript
function getResults(groups);
~~~

**clear result from result cache**

~~~ javascript
function clearOneResult(id);
~~~

**clear results from result cache by groups**

~~~ javascript
function clearResults(groups);
~~~

**deregister a field**

~~~ javascript
function deregister(id, callback);
~~~

**print validation info**

~~~ javascript
function printValidationInfo();
~~~

**print group info**

~~~ javascript
function printGroupInfo();
~~~

**print all info**

~~~ javascript
function printAllInfo();
~~~

### Example

The following is an example:

~~~ javascript
const id = 'test.id';
const group = 'test.group';
const invalidGroup = "test.group.invalid";
const groups = [group];
const name = 'test.name';
const getter =() => 5;
const tip = 'value must less than 5.';
const validationChain = [({name, value}) => value < 5? '': tip];
const field = {id, groups, getter, name};

const validator = createValidator();
validator.register(field, validationChain);
validator.addGroup(id, invalidGroup);
const result = validator.validate([invalidGroup]);
~~~

### Tools

we provide a tools diretory that contains some commomly used function to reduce workload. and it's alternative.
[Tools](./TOOLS.md)

### Contribution

report issue and pull request are welcomed. 

### LICENSE

 MIT
