'use strict';

module.exports = function(hectic) {
  class Link extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'link',
        name: options.name || 'Unnamed Link',
        description: options.description || 'Undescribed Link',
        isDoor: options.isDoor !== undefined ? options.isDoor : false,
        state: options.state || 'open',
        key: options.key || null
      });
    }
  }

  return Link;
};