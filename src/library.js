'use strict';

const glob = require('glob');
const path = require('path');
const async = require('async');

const DEFAULT = 'DEFAULT';
const DEFAULT_PATH = path.resolve(path.join(__dirname, '/../library'));

function Library() {
  const self = this;

  //////////

  this.library = {
    collection: {},
    count: 0,
    ids: {},
    short: {}
  };

  this.instances = {
    collection: {},
    count: 0,
    ids: {},
    short: {}
  };

  //////////

  function loader(file, callback) {
    try {
      const object = require(file);
      const type = object.type;
      const id = object.id;
      const short = id.substring(0, 12);

      if (!Array.isArray(self.library.collection[type])) {
        self.library.collection[type] = [];
      }

      self.library.collection[type].push(object);
      self.library.ids[id] = object;
      self.library.short[short] = object;
      self.library.count++;

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
