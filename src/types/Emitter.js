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

      return async.map(Array.from(callbacks), (handler, next) => { handler(data, next); });
    }

    $on(pattern, ...args) {
      const callback = args.pop();
      const condition = args.pop();

      const [ key, regExp ] = this.$parsePattern(pattern);

      if (!this.$listeners[key]) {
        this.$listeners[key] = {
          pattern: key,
          regExp,
          listerners: new Set(),
          conditions: new Map()
        };
      }

      this.$listeners[key].listeners.add(callback);
      this.$listeners[key].conditions.set(callback, condition);
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
