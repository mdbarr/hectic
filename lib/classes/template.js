'use strict';

module.exports = function(hectic) {
  class Template extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'template',
        name: options.name || 'Unnamed Template',
        description: options.description || 'Undescribed Template'
      });
    }
  }

  return Template;
};