'use strict';

module.exports = function(hectic) {
  class Collection {
    constructor(items = []) {
      this.object = 'collection';

      this.contents = {};
      this.types = {};
      this.instances = new Set();

      items.forEach((item) => {
        this.add(item);
      });
    }

    add(object) {
      if (typeof object === 'string') {
        object = hectic.library.lookup(object);
      }

      if (this.instances.has(object)) {
        return;
      }

      const {
        id, type
      } = object;

      if (this.contents[id] instanceof Set) {
        this.contents[id] = new Set();
      }
      this.contents[id].add(object);

      if (!Array.isArray(this.types[type])) {
        this.types[type] = new Set();
      }
      this.types[type].add(object);

      this.instances.add(object);
    }

    remove(object) {
      if (typeof object === 'string') {
        object = hectic.library.lookup(object);
      }

      if (this.instances.has(object)) {
        return;
      }

      const {
        id, type
      } = object;

      if (!(this.content[id] instanceof Set)) {
        return; // error?
      }

      this.contents[id].delete(object);

      if (this.contents[id].size === 0) {
        delete this.contents[id];
      }

      if (!(this.types[type] instanceof Set)) {
        return; // error?
      }

      this.types[type].delete(object);

      if (this.types[type].size === 0) {
        delete this.types[type];
      }

      this.instances.delete(object);
    }

    list() {
      return Array.from(this.instances);
    }
  }

  hectic.types.register('Collection', Collection);
};
