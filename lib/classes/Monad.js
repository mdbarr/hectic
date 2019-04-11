'use strict';

const IS_REGEXP = /^is[A-Z]/;

module.exports = function(hectic) {
  class Monad extends hectic.classes.Emitter {
    constructor() {
      super();
      this.object = 'monad';

      const state = {};
      const getters = {};

      this.$actual = new Proxy({}, {
        get(object, property) {
          if (IS_REGEXP.test(property)) {
            property = property.substring(2, property.length);
            return Boolean(this.$actual[property]);
          }

          if (getters[property]) {
            return getters[property]();
          }

          if (state[property] !== undefined) {
            return state[property];
          }

          if (object[property]) {
            return object[property];
          }

          if (object.flags && object.flags[property]) {
            return object.flags[property];
          }

          if (object.preferences && object.preferences[property]) {
            return object.preferences[property];
          }

          return undefined;
        },
        set(object, property, value) {
          if (typeof value === 'function') {
            getters[property] = value;
          } else {
            state[property] = value;
          }
          return true;
        }
      });
    }
  }

  hectic.classes.register('Monad', Monad);
};
