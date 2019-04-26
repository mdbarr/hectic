'use strict';

module.exports = function(hectic) {
  class Area extends hectic.types.Monad {
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

      for (const room of this.rooms) {
        hectic.types.create(room.$resolve);
      }
    }
  }

  hectic.types.register('Area', Area);
};
