'use strict';

module.exports = function(hectic) {
  class Area extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'area',
        name: options.name || 'Unnamed Area',
        description: options.description || 'Undescribed Area',
        region: options.region || null,
        rooms: options.rooms || {}
      });
    }
  }

  return Area;
};
