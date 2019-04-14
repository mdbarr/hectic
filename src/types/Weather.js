'use strict';

module.exports = function(hectic) {
  class Weather extends hectic.types.Monad {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'weather',
        name: options.name || 'Unnamed Weather System',
        description: options.description || 'Undescribed Weather System',
        region: options.region || null
      });
    }
  }

  hectic.types.register('Weather', Weather);
};