'use strict';

exports.client = function connect (opts = {}) {
  const Discogs = require('disconnect').Client;
  const pkg = require('../package.json');
  const la = require('lazy-ass');

  const userToken = opts.userToken || process.env.DISCOGS_USER_TOKEN;

  la(typeof(userToken) === 'string' && userToken,
    'DISCOGS_USER_TOKEN env var or "userToken" option should be a non-empty string');

  return new Discogs(`{pkg.name}/{pkg.version}`, {userToken});
};

