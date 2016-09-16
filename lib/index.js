'use strict';

const config = require('./config');
const through2 = require('through2');
const _ = require('lodash');
const unique = require('unique-stream');

function getKey (track) {
  return track['Persistent ID'] ? track['Persistent ID'] : _.find(track,
    (value, key) => keyRx.test(key) && typeof(value) === 'string')
    .trim();
}

config.set('xmlPath', '/Users/boneskull/Music/iTunes/iTunes Library.xml');
config.set('discogsCollection', 'iTunes');
const localDb = require('./db').localDb;
const keyRx = /ID$/;
const iTunesStream = require('./itunes-stream')
  .pipe(through2.obj(function (track, enc, next) {
    const PID = getKey(track);
    if (PID) {
      track.PID = PID;
      this.push(track);
    }
    next();
  }))
  .pipe(through2.obj(function (track, enc, next) {
    const key = track['PID'];
    const album = (track['Album'] || '').trim();
    const artist = (track['Album Artist'] || track['Artist'] || '').trim();
    if (album && artist) {
      this.push({
        key,
        value: {
          album,
          artist
        }
      });
    }
    next();
  }))
  .on('error', err => {
    throw err;
  });

let count = 0;
iTunesStream.pipe(through2.obj(function (data, enc, next) {
  localDb.get(data.key, (err, value) => {
    if (err) {
      if (err.notFound) {
        this.push(data);
        console.error(++count);
        return next();
      }
      return next(err);
    }
    if (value.album !== data.value.album ||
      value.artist !== data.value.artist) {
      console.error(++count);
      this.push(data);
    }
    next();
  });
}))
  .pipe(localDb.createWriteStream())
  .on('error', err => {
    throw err;
  });
//
// iTunesStream.pipe(through2.obj(function (data, enc, next) {
//   this.push(data.value);
//   next();
// }))
//   .pipe(unique())
//   .pipe(through2.obj(function (data, enc, next) {
//     console.error(data);
//     next();
//   }));

// localDb.createReadStream()
//   .on('data', function (data) {
//     console.log(data.key, '=', JSON.stringify(data.value))
//   })
//   .on('error', function (err) {
//     console.log('Oh my!', err)
//   })
//   .on('close', function () {
//     console.log('Stream closed')
//   })
//   .on('end', function () {
//     console.log('Stream closed')
//   })
//
