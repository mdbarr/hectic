'use strict';

module.exports = function(hectic) {
  class Exit extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'exit',
        name: options.name || 'Unnamed Exit',
        description: options.description || 'Undescribed Exit',
        isDoor: options.isDoor !== undefined ? options.isDoor : false,
        state: options.state || 'open',
        key: options.key || null
      });
    }
  }

  return Exit;
};
