'use strict';

module.exports = function(hectic) {
  class World extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'world',
        name: options.name || 'Unnamed World',
        description: options.description || 'Undescribed World',
        regions: options.regions || {}
      });
    }
  }

  return World;
};
