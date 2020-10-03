/* eslint-disable camelcase */
'use strict';
/**
 * Telnet server implementation.
 *
 * References:
 *  - http://tools.ietf.org/html/rfc854
 *  - http://support.microsoft.com/kb/231866
 *  - http://www.iana.org/assignments/telnet-options
 *
 */

const net = require('net');
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const Stream = require('stream').Stream;
const util = require('util');

//////////
// Constants

const COMMANDS = {
  SE: 240, // end of subnegotiation parameters
  NOP: 241, // no operation
  DM: 242, // data mark
  BRK: 243, // break
  IP: 244, // suspend (a.k.a. "interrupt process")
  AO: 245, // abort output
  AYT: 246, // are you there?
  EC: 247, // erase character
  EL: 248, // erase line
  GA: 249, // go ahead
  SB: 250, // subnegotiation
  WILL: 251, // will
  WONT: 252, // wont
  DO: 253, // do
  DONT: 254, // dont
  IAC: 255, // interpret as command
};

const COMMAND_NAMES = {};
for (const key in COMMANDS) {
  const value = COMMANDS[key];
  COMMAND_NAMES[value] = key.toLowerCase();
}

const OPTIONS = {
  TRANSMIT_BINARY: 0, // http://tools.ietf.org/html/rfc856
  ECHO: 1, // http://tools.ietf.org/html/rfc857
  RECONNECT: 2, // http://tools.ietf.org/html/rfc671
  SUPPRESS_GO_AHEAD: 3, // http://tools.ietf.org/html/rfc858
  AMSN: 4, // Approx Message Size Negotiation
  // https://google.com/search?q=telnet+option+AMSN
  STATUS: 5, // http://tools.ietf.org/html/rfc859
  TIMING_MARK: 6, // http://tools.ietf.org/html/rfc860
  RCTE: 7, // http://tools.ietf.org/html/rfc563
  // http://tools.ietf.org/html/rfc726
  NAOL: 8, // (Negotiate) Output Line Width
  // https://google.com/search?q=telnet+option+NAOL
  // http://tools.ietf.org/html/rfc1073
  NAOP: 9, // (Negotiate) Output Page Size
  // https://google.com/search?q=telnet+option+NAOP
  // http://tools.ietf.org/html/rfc1073
  NAOCRD: 10, // http://tools.ietf.org/html/rfc652
  NAOHTS: 11, // http://tools.ietf.org/html/rfc653
  NAOHTD: 12, // http://tools.ietf.org/html/rfc654
  NAOFFD: 13, // http://tools.ietf.org/html/rfc655
  NAOVTS: 14, // http://tools.ietf.org/html/rfc656
  NAOVTD: 15, // http://tools.ietf.org/html/rfc657
  NAOLFD: 16, // http://tools.ietf.org/html/rfc658
  EXTEND_ASCII: 17, // http://tools.ietf.org/html/rfc698
  LOGOUT: 18, // http://tools.ietf.org/html/rfc727
  BM: 19, // http://tools.ietf.org/html/rfc735
  DET: 20, // http://tools.ietf.org/html/rfc732
  // http://tools.ietf.org/html/rfc1043
  SUPDUP: 21, // http://tools.ietf.org/html/rfc734
  // http://tools.ietf.org/html/rfc736
  SUPDUP_OUTPUT: 22, // http://tools.ietf.org/html/rfc749
  SEND_LOCATION: 23, // http://tools.ietf.org/html/rfc779
  TERMINAL_TYPE: 24, // http://tools.ietf.org/html/rfc1091
  END_OF_RECORD: 25, // http://tools.ietf.org/html/rfc885
  TUID: 26, // http://tools.ietf.org/html/rfc927
  OUTMRK: 27, // http://tools.ietf.org/html/rfc933
  TTYLOC: 28, // http://tools.ietf.org/html/rfc946
  REGIME_3270: 29, // http://tools.ietf.org/html/rfc1041
  X3_PAD: 30, // http://tools.ietf.org/html/rfc1053
  NAWS: 31, // http://tools.ietf.org/html/rfc1073
  TERMINAL_SPEED: 32, // http://tools.ietf.org/html/rfc1079
  TOGGLE_FLOW_CONTROL: 33, // http://tools.ietf.org/html/rfc1372
  LINEMODE: 34, // http://tools.ietf.org/html/rfc1184
  X_DISPLAY_LOCATION: 35, // http://tools.ietf.org/html/rfc1096
  ENVIRON: 36, // http://tools.ietf.org/html/rfc1408
  AUTHENTICATION: 37, // http://tools.ietf.org/html/rfc2941
  // http://tools.ietf.org/html/rfc1416
  // http://tools.ietf.org/html/rfc2942
  // http://tools.ietf.org/html/rfc2943
  // http://tools.ietf.org/html/rfc2951
  ENCRYPT: 38, // http://tools.ietf.org/html/rfc2946
  NEW_ENVIRON: 39, // http://tools.ietf.org/html/rfc1572
  TN3270E: 40, // http://tools.ietf.org/html/rfc2355
  XAUTH: 41, // https://google.com/search?q=telnet+option+XAUTH
  CHARSET: 42, // http://tools.ietf.org/html/rfc2066
  RSP: 43, // http://tools.ietf.org/html/draft-barnes-telnet-rsp-opt-01
  COM_PORT_OPTION: 44, // http://tools.ietf.org/html/rfc2217
  SLE: 45, // http://tools.ietf.org/html/draft-rfced-exp-atmar-00
  START_TLS: 46, // http://tools.ietf.org/html/draft-altman-telnet-starttls-02
  KERMIT: 47, // http://tools.ietf.org/html/rfc2840
  SEND_URL: 48, // http://tools.ietf.org/html/draft-croft-telnet-url-trans-00
  FORWARD_X: 49, // http://tools.ietf.org/html/draft-altman-telnet-fwdx-01
  PRAGMA_LOGON: 138, // https://google.com/search?q=telnet+option+PRAGMA_LOGON
  SSPI_LOGON: 139, // https://google.com/search?q=telnet+option+SSPI_LOGON
  PRAGMA_HEARTBEAT: 140, // https://google.com/search?q=telnet+option+PRAMGA_HEARTBEAT
  EXOPL: 255, // http://tools.ietf.org/html/rfc861
};

const OPTION_NAMES = {};
for (const key in OPTIONS) {
  const value = OPTIONS[key];
  OPTION_NAMES[value] = key.toLowerCase();
}

const SUB = {
  IS: 0,
  SEND: 1,
  INFO: 2,
  VARIABLE: 0,
  VALUE: 1,
  ESC: 2, // unused, for env
  USER_VARIABLE: 3,
};

//////////
// Client

class Client extends Stream {
  constructor (options, ...args) {
    super();

    if (options.addListener) {
      options = {
        input: options,
        output: args[0],
        server: args[1],
      };
    }

    if (options.socket) {
      options.input = options.socket;
      options.output = options.socket;
    }

    if (!options.output) {
      options.output = options.input;
      options.socket = options.input;
    }

    this.input = options.input;
    this.output = options.output;
    this.socket = options.socket;
    this.server = options.server;
    this.env = {};
    this.terminal = 'ansi';

    this.options = options;
    this.options.convertLF = options.convertLF !== false;

    if (this.options.tty) {
      this.setRawMode = this._setRawMode;
      this.isTTY = true;
      this.isRaw = false;
      this.columns = 80;
      this.rows = 24;
    }

    this.open();
  }

  debug (...args) {
    let msg;

    if (!this.remoteAddress && this.input.remoteAddress) {
      this.remoteAddress = this.input.remoteAddress;
    }

    args.push(`(${ this.remoteAddress })`);

    if (this.listeners('debug').length) {
      msg = util.format.apply(util.format, args);
      this.emit('debug', msg);
    }

    if (this.server && this.server.listeners('debug').length) {
      msg = util.format.apply(util.format, args);
      this.server.emit('debug', msg);
    }

    if (this.options.debug) {
      args.push(`(${ this.input.remoteAddress })`);
      console.error(args);
    }
  }

  open () {
    for (const commandName of [ 'DO', 'DONT', 'WILL', 'WONT' ]) {
      this[commandName.toLowerCase()] = {};
      for (const optionName in OPTIONS) {
        const optionCode = OPTIONS[optionName];
        this[commandName.toLowerCase()][optionName.toLowerCase()] = function() {
          const buf = Buffer.alloc(3);
          buf[0] = COMMANDS.IAC;
          buf[1] = COMMANDS[commandName];
          buf[2] = optionCode;
          return this.output.write(buf);
        };
      }

      const cmd = commandName.toLowerCase();
      this[cmd].window_size = this[cmd].naws;
      this[cmd].environment_variables = this[cmd].new_environ;
    }

    this.input.on('end', () => {
      this.debug('ended');
      this.emit('end');
    });

    this.input.on('close', () => {
      this.debug('closed');
      this.emit('close');
    });

    this.input.on('drain', () => {
      this.emit('drain');
    });

    this.input.on('error', (err) => {
      this.debug('error: %s', err ? `${ err.message }` : 'Unknown');
      this.emit('error', err);
    });

    this.input.on('data', (data) => {
      this.parse(data);
    });

    if (this.options.tty) {
      this.do.transmit_binary();
      this.do.terminal_type();
      this.do.naws();
      this.do.new_environ();
    }
  }

  parse (data) {
    const bufs = [];
    let i = 0;
    let l = 0;
    let needsPush = false;
    let cdata;
    let iacCode;
    let iacName;
    let commandCode;
    let commandName;
    let optionCode;
    let optionName;
    let cmd;
    let len;

    if (this._last) {
      data = Buffer.concat([ this._last.data, data ]);
      i = this._last.i;
      l = this._last.l;
      delete this._last;
    }

    for (; i < data.length; i++) {
      if (data.length - 1 - i >= 2 &&
        data[i] === COMMANDS.IAC &&
        COMMAND_NAMES[data[i + 1]] &&
        OPTION_NAMES[data[i + 2]]) {
        cdata = data.slice(i);

        iacCode = cdata.readUInt8(0);
        iacName = COMMAND_NAMES[iacCode];
        commandCode = cdata.readUInt8(1);
        commandName = COMMAND_NAMES[commandCode];
        optionCode = cdata.readUInt8(2);
        optionName = OPTION_NAMES[optionCode];

        cmd = {
          command: commandName, // compat
          option: optionName.replace(/_/g, ' '), // compat
          iacCode,
          iacName,
          commandCode,
          commandName,
          optionCode,
          optionName,
          data: cdata,
        };

        // compat
        if (cmd.option === 'new environ') {
          cmd.option = 'environment variables';
        } else if (cmd.option === 'naws') {
          cmd.option = 'window size';
        }

        if (this[cmd.optionName]) {
          try {
            len = this[cmd.optionName](cmd);
          } catch (e) {
            if (!(e instanceof RangeError)) {
              this.debug('error: %s', e.message);
              this.emit('error', e);
              return;
            }
            len = -1;
            this.debug('Not enough data to parse.');
          }
        } else {
          if (cmd.commandCode === COMMANDS.SB) {
            len = 0;
            while (cdata[len] && cdata[len] !== COMMANDS.SE) {
              len++;
            }
            if (!cdata[len]) {
              len = 3;
            } else {
              len++;
            }
          } else {
            len = 3;
          }
          cmd.data = cmd.data.slice(0, len);
          this.debug('Unknown option: %s', cmd.optionName);
        }

        if (len === -1) {
          this.debug('Waiting for more data.');
          this.debug(iacName, commandName, optionName, cmd.values || len);
          this._last = {
            data,
            i,
            l,
          };
          return;
        }

        this.debug(iacName, commandName, optionName, cmd.values || len);

        this.emit('command', cmd);

        needsPush = true;
        l = i + len;
        i += len - 1;
      } else {
        if (data[i] === COMMANDS.IAC && data.length - 1 - i < 2) {
          this.debug('Waiting for more data.');
          this._last = {
            data: data.slice(i),
            i: 0,
            l: 0,
          };
          if (i > l) {
            this.emit('data', data.slice(l, i));
          }
          return;
        }
        if (needsPush || i === data.length - 1) {
          bufs.push(data.slice(l, i + 1));
          needsPush = false;
        }
      }
    }

    if (bufs.length) {
      this.emit('data', Buffer.concat(bufs));
    }
  }

  echo (cmd) {
    if (cmd.data.length < 3) { return -1; }
    cmd.data = cmd.data.slice(0, 3);
    this.emit('echo', cmd);
    return 3;
  }

  status (cmd) {
    if (cmd.data.length < 3) { return -1; }
    cmd.data = cmd.data.slice(0, 3);
    this.emit('status', cmd);
    return 3;
  }

  linemode (cmd) {
    if (cmd.data.length < 3) { return -1; }
    cmd.data = cmd.data.slice(0, 3);
    this.emit('linemode', cmd);
    return 3;
  }

  transmit_binary (cmd) {
    if (cmd.data.length < 3) { return -1; }
    cmd.data = cmd.data.slice(0, 3);
    this.emit('transmit binary', cmd);
    return 3;
  }

  authentication (cmd) {
    if (cmd.data.length < 3) { return -1; }
    cmd.data = cmd.data.slice(0, 3);
    this.emit('authentication', cmd);
    return 3;
  }

  terminal_speed (cmd) {
    if (cmd.data.length < 3) { return -1; }
    cmd.data = cmd.data.slice(0, 3);
    this.emit('terminal speed', cmd);
    return 3;
  }

  remote_flow_control (cmd) {
    if (cmd.data.length < 3) { return -1; }
    cmd.data = cmd.data.slice(0, 3);
    this.emit('remote flow control', cmd);
    return 3;
  }

  x_display_location (cmd) {
    if (cmd.data.length < 3) { return -1; }
    cmd.data = cmd.data.slice(0, 3);
    this.emit('x display location', cmd);
    return 3;
  }

  suppress_go_ahead (cmd) {
    if (cmd.data.length < 3) { return -1; }
    cmd.data = cmd.data.slice(0, 3);
    this.emit('suppress go ahead', cmd);
    return 3;
  }

  naws (cmd) {
    const data = cmd.data;
    let i = 0;

    if (cmd.commandCode !== COMMANDS.SB) {
      if (data.length < 3) { return -1; }
      cmd.data = cmd.data.slice(0, 3);
      this.emit('window size', cmd); // compat
      this.emit('naws', cmd);
      return 3;
    }

    if (data.length < 9) { return -1; }

    const iac1 = data.readUInt8(i);
    i += 1;
    const sb = data.readUInt8(i);
    i += 1;
    const naws = data.readUInt8(i);
    i += 1;
    const width = data.readUInt16BE(i);
    i += 2;
    const height = data.readUInt16BE(i);
    i += 2;
    const iac2 = data.readUInt8(i);
    i += 1;
    const se = data.readUInt8(i);
    i += 1;

    assert(iac1 === COMMANDS.IAC);
    assert(sb === COMMANDS.SB);
    assert(naws === OPTIONS.NAWS);
    assert(iac2 === COMMANDS.IAC);
    assert(se === COMMANDS.SE);

    cmd.cols = width;
    cmd.columns = width;
    cmd.width = width;
    cmd.rows = height;
    cmd.height = height;

    cmd.values = [ cmd.width, cmd.height ];

    cmd.data = cmd.data.slice(0, i);

    if (this.options.tty) {
      this.columns = width;
      this.rows = height;
      this.emit('resize');
    }

    this.emit('window size', cmd); // compat
    this.emit('naws', cmd);

    this.emit('size', width, height);

    return i;
  }

  window_size (cmd) {
    return this.naws(cmd);
  }

  new_environ (cmd) {
    const data = cmd.data;
    let i = 0;

    if (cmd.commandCode !== COMMANDS.SB) {
      if (data.length < 3) { return -1; }
      cmd.data = cmd.data.slice(0, 3);
      this.emit('environment variables', cmd); // compat
      this.emit('new environ', cmd);
      return 3;
    }

    if (data.length < 10) { return -1; }

    const iac1 = data.readUInt8(i);
    i += 1;
    const sb = data.readUInt8(i);
    i += 1;
    const newenv = data.readUInt8(i);
    i += 1;
    const info = data.readUInt8(i);
    i += 1;
    const variable = data.readUInt8(i);
    i += 1;

    let name;
    for (let s = i; i < data.length; i++) {
      if (data[i] === SUB.VALUE) {
        name = data.toString('ascii', s, i);
        i++;
        break;
      }
    }

    let value;
    for (let s = i; i < data.length; i++) {
      if (data[i] === COMMANDS.IAC) {
        value = data.toString('ascii', s, i);
        break;
      }
    }

    const iac2 = data.readUInt8(i);
    i += 1;
    const se = data.readUInt8(i);
    i += 1;

    assert(iac1 === COMMANDS.IAC);
    assert(sb === COMMANDS.SB);
    assert(newenv === OPTIONS.NEW_ENVIRON);
    assert(info === SUB.INFO);
    assert(variable === SUB.VARIABLE || variable === SUB.USER_VARIABLE);
    assert(name.length > 0);
    assert(value.length > 0);
    assert(iac2 === COMMANDS.IAC);
    assert(se === COMMANDS.SE);

    cmd.name = name;
    cmd.value = value;
    cmd.type = variable === SUB.VARIABLE ?
      'system' :
      'user';

    // Always uppercase for some reason.
    if (cmd.name === 'TERM') {
      cmd.value = cmd.value.toLowerCase();
      this.terminal = cmd.value;
      this.emit('term', cmd.value);
    }

    cmd.values = [ cmd.name, cmd.value, cmd.type ];

    cmd.data = cmd.data.slice(0, i);

    this.env[cmd.name] = cmd.value;

    this.emit('environment variables', cmd); // compat
    this.emit('new environ', cmd);

    this.emit('env', cmd.name, cmd.value, cmd.type);

    return i;
  }

  environment_variables (cmd) {
    return this.new_environ(cmd);
  }

  terminal_type (cmd) {
    const data = cmd.data;
    let i = 0;

    if (cmd.commandCode !== COMMANDS.SB) {
      if (data.length < 3) { return -1; }
      cmd.data = cmd.data.slice(0, 3);
      this.emit('terminal type', cmd);
      if (cmd.commandCode === COMMANDS.WILL) {
        this.output.write(new Buffer([
          COMMANDS.IAC,
          COMMANDS.SB,
          OPTIONS.TERMINAL_TYPE,
          SUB.SEND,
          COMMANDS.IAC,
          COMMANDS.SE,
        ]));
      }
      return 3;
    }

    if (data.length < 7) { return -1; }

    const iac1 = data.readUInt8(i);
    i += 1;
    const sb = data.readUInt8(i);
    i += 1;
    const termtype = data.readUInt8(i);
    i += 1;
    const is = data.readUInt8(i);
    i += 1;

    let name;
    for (let s = i; i < data.length; i++) {
      if (data[i] === COMMANDS.IAC) {
        name = data.toString('ascii', s, i);
        break;
      }
    }

    const iac2 = data.readUInt8(i);
    i += 1;
    const se = data.readUInt8(i);
    i += 1;

    assert(iac1 === COMMANDS.IAC);
    assert(sb === COMMANDS.SB);
    assert(termtype === OPTIONS.TERMINAL_TYPE);
    assert(is === SUB.IS);
    assert(name.length > 0);
    assert(iac2 === COMMANDS.IAC);
    assert(se === COMMANDS.SE);

    // Always uppercase for some reason.
    cmd.name = name.toLowerCase();

    cmd.values = [ cmd.name ];

    cmd.data = cmd.data.slice(0, i);

    this.terminal = cmd.name;

    this.emit('terminal type', cmd);

    this.emit('term', cmd.name);

    return i;
  }

  _setRawMode (mode) {
    this.isRaw = mode;
    if (!this.writable) { return; }
    if (mode) {
      this.debug('switching to raw:');
      this.do.suppress_go_ahead();
      this.will.suppress_go_ahead();
      this.will.echo();
      this.debug('switched to raw');
    } else {
      this.debug('switching to cooked:');
      this.dont.suppress_go_ahead();
      this.wont.suppress_go_ahead();
      this.wont.echo();
      this.debug('switched to cooked');
    }
  }

  get readbale () {
    return this.input.readable;
  }

  get writable () {
    return this.output.writable;
  }

  get destroyed () {
    return this.output.destroyed;
  }

  pause (...args) {
    return this.input.pause(...args);
  }

  resume (...args) {
    return this.input.resume(...args);
  }

  write (...args) {
    if (this.options.convertLF) {
      args[0] = args[0].toString('utf8').replace(/\r?\n/g, '\r\n');
    }
    return this.output.write(...args);
  }

  end (...args) {
    return this.output.end(...args);
  }

  destroy (...args) {
    return this.output.destroy(...args);
  }

  destroySoon (...args) {
    return this.output.destroySoon.apply(...args);
  }
}

//////////
// Server

class Server extends EventEmitter {
  constructor (options, callback) {
    super();

    if (!(this instanceof Server)) {
      return new Server(options, callback);
    }

    if (typeof options !== 'object') {
      callback = options;
      options = null;
    }

    options = options || {};

    this.server = net.createServer((socket) => {
      const client = new Client(Object.assign({}, options, {
        input: socket,
        output: socket,
        server: this,
      }));

      this.emit('connection', client);
      this.emit('client', client); // compat

      if (callback) {
        return callback(client);
      }
      return client;
    });

    for (const name of [ 'error', 'listening', 'close' ]) {
      this.server.on(name, (...args) => {
        this.emit(name, ...args);
      });
    }

    for (const key in this.server) {
      const value = this.server[key];
      if (typeof value === 'function') {
        this[key] = (...args) => this.server[key](...args);
      }
    }
  }
}

//////////

module.exports = {
  Client,
  Server,
};
