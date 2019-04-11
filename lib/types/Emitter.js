'use strict';

const async = require('async');

module.exports = function(hectic) {
  class Emitter {
    constructor() {
      this.$listeners = {};
      this.object = 'emitter';
    }

    $parsePattern(pattern) {
      let regExp;

      if (pattern instanceof RegExp) {
        regExp = pattern;
      } else if (pattern.startsWith('/') && pattern.endsWith('/')) {
        regExp = new RegExp(pattern.substring(1, pattern.length - 1));
      } else {
        pattern = `^${ pattern.
          replace(/([*+])/g, '.$1').
          replace(/(\/)/g, '\\\\') }$`;
        regExp = new RegExp(pattern);
      }

      const key = regExp.toString();

      console.log(key, regExp);

      return [ key, regExp ];
    }

    $emit(event) {
      if (!(event instanceof hectic.types.Event)) {
        return;
      }

      const callbacks = new Set();
      for (const key in this.$listeners) {
        const listener = this.$listeners[key];
        if (listener.regExp.test(event.type)) {
          listener.listeners.forEach(cb => { return callbacks.add(cb); });
        }
      }

      async.applyEach(callbacks, event, () => {
        console.log('done', event.$handled);
      });
    }

    $on(pattern, callback) {
      const [ key, regExp ] = this.$parsePattern(pattern);

      if (!this.$listeners[key]) {
        this.$listeners[key] = {
          pattern: key,
          regExp,
          listerners: new Set()
        };
      }

      this.$listeners[key].listeners.add(callback);
    }

    $off(pattern, callback) {
      const [ key ] = this.$parsePattern(pattern);

      if (this.$listeners[key]) {
        this.$listeners[key].listeners.delete(callback);
      }
    }
  }

  hectic.types.register('Emitter', Emitter);
};
