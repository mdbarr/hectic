'use strict';

const glob = require('glob');
const path = require('path');
const async = require('async');

const DEFAULT = 'DEFAULT';
const DEFAULT_PATH = path.resolve(path.join(__dirname, '/../library'));

function Library(hectic) {
  const self = this;

  //////////

  const library = {
    collection: {},
    count: 0,
    ids: {},
    short: {}
  };

  const instances = {
    collection: {},
    count: 0,
    ids: {},
    short: {}
  };

  Object.defineProperty(String.prototype, '$resolve', {
    value() {
      if (this) {
        if (instances.short[this]) {
          return instances.short[this];
        } else if (instances.ids[this]) {
          return instances.ids[this];
        } else if (library.short[this]) {
          return library.short[this];
        } else if (library.ids[this]) {
          return library.ids[this];
        }
      }
      return undefined;
    },
    enumerable: false,
    configurable: true
  });

  //////////

  function loader(file, callback) {
    try {
      const object = require(file);
      const type = object.object;
      const id = object.id;
      const short = id.substring(0, hectic.config['short-id-length']);

      if (!Array.isArray(library.collection[type])) {
        library.collection[type] = [];
      }

      library.collection[type].push(object);
      library.ids[id] = object;
      library.short[short] = object;
      library.count++;

      return callback(null, id);
    } catch (error) {
      return callback(error);
    }
  }

  self.load = function(libraryPath = DEFAULT, callback = null) {
    if (typeof libraryPath === 'function' && callback === null) {
      callback = libraryPath;
      libraryPath = DEFAULT_PATH;
    }

    if (libraryPath === 'DEFAULT') {
      libraryPath = DEFAULT_PATH;
    }

    return glob(`${ libraryPath }/**/*.js?(on)`, (error, files) => {
      if (error) {
        return callback(error);
      }

      return async.each(files, loader, (error) => {
        return callback(error);
      });
    });
  };

  //////////

  return self;
}

module.exports = function(hectic) {
  return new Library(hectic);
};
