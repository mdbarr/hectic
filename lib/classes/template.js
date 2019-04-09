'use strict';

module.exports = function(hectic) {
  class Template extends hectic.classes.Monad {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'template',
        name: options.name || 'Unnamed Template',
        description: options.description || 'Undescribed Template'
      });
    }
  }

  hectic.classes.Template = Template;
};
