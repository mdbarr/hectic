'use strict';

module.exports = function(hectic) {
  class Link extends hectic.types.Monad {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'link',
        name: options.name || 'Unnamed Link',
        description: options.description || 'Undescribed Link',
        isDoor: options.isDoor !== undefined ? options.isDoor : false,
        state: options.state || 'open',
        key: options.key || null
      });
    }
  }

  hectic.types.register('Link', Link);
};
