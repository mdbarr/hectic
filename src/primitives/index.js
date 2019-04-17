'use strict';

module.exports = function(hectic) {
  hectic.primitives = {};

  hectic.primitives.Collection = require('./Collection')(hectic);
  hectic.primitives.Enum = require('./Enum')(hectic);
  hectic.primitives.Range = require('./Range')(hectic);

  return hectic.primitives;
};
