'use strict';

require('barrkeep/shim');

const defaults = {};

function Hectic(config = {}) {
  const self = this;

  //////////
  // Config

  self.config = Object.$merge(defaults, config, true);

  //////////
  // Modules

  self.utils = require('./utils')(self);

  //////////
  // Classes

  self.classes = {};
  self.classes.Event = require('./classes/Event')(self);
  self.classes.Emitter = require('./classes/Emitter')(self);
  self.classes.Clock = require('./classes/Clock')(self);
  self.classes.World = require('./classes/World')(self);
  self.classes.Climate = require('./classes/Climate')(self);
  self.classes.Weather = require('./classes/Weather')(self);

  self.classes.Region = require('./classes/Region')(self);
  self.classes.Area = require('./classes/Area')(self);
  self.classes.Link = require('./classes/Link')(self);
  self.classes.Room = require('./classes/Room')(self);

  self.classes.Person = require('./classes/Person')(self);
  self.classes.Player = require('./classes/Player')(self);
  self.classes.NPC = require('./classes/NPC')(self);

  self.classes.Creature = require('./classes/Creature')(self);

  self.classes.Object = require('./classes/Object')(self);

  //////////
  // Boot

  self.boot = () => {};

  return this;
}

module.exports = Hectic;
