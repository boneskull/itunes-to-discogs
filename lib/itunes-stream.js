'use strict';

const config = require('./config');

let trackCount = 0;
const parser = require('itunes-data')
  .parser()
  .on('track', function onTrack (...args) {
    this.emit('data', ...args);
    console.error(`${++trackCount}`);
  })
  .on('error', err => {
    throw new Error(err);
  });

parser.queue = [];
parser.write = function (data) {
  if (!this.writable) {
    this.readable = false;
    this.queue.push(data);
    return false;
  }
  return this._write(data);
};

parser._write = function (data) {
  this.readable = true;
  let result;
  let error;
  try {
    result = this.parse(data);
    if (!result) {
      error = this.getError();
    }
  } catch (e) {
    error = e;
  }
  if (error) {
    this.emit('error', error);
    this.emit('close');
  }
  return result;
};

parser.pause = function () {
  if (this.writable) {
    this.writable = false;
    this.parser.stop();
  }
};

parser.resume = function () {
  if (!this.writable) {
    this.writable = true;
    this.parser.resume();
  }
  if (this.queue.length) {
    while (this.queue.length && this.writable) {
      const data = this.queue.shift();
      this._write(data);
    }
  } else {
    this.readable = false;
  }
};

module.exports = require('fs')
  .createReadStream(config.get('xmlPath'))
  .pipe(parser);
