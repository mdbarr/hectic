'use strict';

module.exports = function(hectic) {
  class Region extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'region',
        name: options.name || 'Unnamed Region',
        description: options.description || 'Undescribed Region',
        weather: options.weather || null,
        areas: options.areas || {}
      });
    }
  }

  return Region;
};
