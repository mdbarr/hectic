'use strict';

module.exports = function(hectic) {
  class Object extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'object',
        name: options.name || 'Unnamed Object',
        description: options.description || 'Undescribed Object'
      });
    }
  }

  return Object;
};
