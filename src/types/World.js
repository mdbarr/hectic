'use strict';

module.exports = function(hectic) {
  class World extends hectic.types.Monad {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'world',
        name: options.name || 'Unnamed World',
        description: options.description || 'Undescribed World',
        regions: options.regions || {}
      });
    }
  }

  hectic.types.register('World', World);
};