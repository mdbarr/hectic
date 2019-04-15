'use strict';

module.exports = function(hectic) {
  class Vehicle extends hectic.types.Monad {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'vehicle',
        name: options.name || 'Unnamed Vehicle',
        description: options.description || 'Undescribed Vehicle',
        capacity: options.capacity || 3,
        rooms: options.rooms || []
      });

      this.flags = Object.$merge({
        air: false,
        ground: true,
        sea: false,
        underwater: false,
        water: false
      });
    }
  }

  hectic.types.register('Vehicle', Vehicle);
};
