'use strict';

module.exports = function(hectic) {
  class Climate extends hectic.types.Monad {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'climate',
        name: options.name || 'Unnamed Climate',
        description: options.description || 'Undescribed Climate',
        temperature: new hectic.types.Range(0, 0, 0),
        humidity: new hectic.types.Range(0, 0, 0),
        pressure: new hectic.types.Range(0, 0, 0),
        wind: new hectic.types.Range(0, 0, 0),
        precipitation: new hectic.types.Range(0, 0, 0)
      });
    }
  }

  hectic.types.register('Climate', Climate);
};
