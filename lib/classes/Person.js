'use strict';

module.exports = function(hectic) {
  class Person extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'person',
        name: options.name || 'Unnamed Person',
        description: options.description || 'Undescribed Person'
      });
    }
  }

  return Person;
};
