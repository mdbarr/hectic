'use strict';

module.exports = function(hectic) {
  class Region extends hectic.types.Monad {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'region',
        name: options.name || 'Unnamed Region',
        description: options.description || 'Undescribed Region',
        climate: options.climate || null,
        weather: options.weather || null,
        areas: options.areas || {}
      });
    }
  }

  hectic.types.register('Region', Region);
};
