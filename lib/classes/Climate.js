'use strict';

module.exports = function(hectic) {
  class Climate extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'climate',
        name: options.name || 'Unnamed Climate',
        description: options.description || 'Undescribed Climate'
      });
    }
  }

  return Climate;
};
