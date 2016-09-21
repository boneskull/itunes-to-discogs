# itunes-to-discogs

> Import iTunes DB into [Discogs](https://www.discogs.com) collection

## Notes

This project should:

- Pull data from iTunes Library XML file
- Stuff data into LevelDB
- Create Discogs Collection for imported albums
- On subsequent runs, compare library info to DB so we can skip adding, update existing data, or remove albums

### Album Identification

- It may be possible to get a Discogs ID (as assigned by [Yate](https://2manyrobots.com/yate/)) out of the ID3 tags.
- The Discogs ID is sometimes stored in [MusicBrainz](https://musicbrainz.org) release data.  We should avoid doing this unless we can't match an album.  Otherwise, trying to match an album to MusicBrainz is out-of-scope.
- Maybe we should write the Discogs ID to the ID3 tags if we find one (and it doesn't already exist).

## License

© 2016 [Christopher Hiller](https://github.com/boneskull).  Licensed MIT.

