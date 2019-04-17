'use strict';

const Hectic = require('../src/hectic');

let hectic;

test('Create a hectic instance', () => {
  hectic = new Hectic();
});

test('Boot the hectic instance', (done) => {
  hectic.boot(done);
});

test('Shutdown the hectic instance', (done) => {
  hectic.shutdown(done);
});
