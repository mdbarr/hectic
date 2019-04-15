'use strict';

const Hectic = require('./src/hectic');

const hectic = new Hectic();

hectic.library.load((error) => {
  if (error) {
    throw error;
  }

  hectic.boot();
});
