'use strict';

const levelup = require('level');
const levelWriteStream = require('level-writestream');
const config = require('./config');
const path = require('path');
const slug = require('slug');

config.set('localDbPath',
  path.join(path.dirname(config.path), slug(`local-${config.get('xmlPath')}`)));

config.set('discogsDbPath', path.join(path.dirname(config.path),
  slug(`discogs-${config.get('discogsCollection')}`)));

Object.defineProperties(exports, {
  localDb: {
    value: levelWriteStream(
      levelup(config.get('localDbPath'), {valueEncoding: 'json'}))
  },
  discogsDb: {
    value: levelWriteStream(levelup(config.get('discogsDbPath')))
  }
});
