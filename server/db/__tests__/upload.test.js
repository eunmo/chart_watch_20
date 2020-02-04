const { dml, query } = require('../query.js');
const {
  Upload: { upload }
} = require('..');

jest.mock('../db.json', () => {
  return {
    host: 'localhost',
    user: 'music',
    password: 'music',
    database: 'musictest'
  };
});

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS ArtistAliases;');
  await dml('DROP TABLE IF EXISTS SongArtists;');
  await dml('DROP TABLE IF EXISTS AlbumArtists;');
  await dml('DROP TABLE IF EXISTS AlbumSongs;');
  await dml('DROP TABLE IF EXISTS Songs;');
  await dml('DROP TABLE IF EXISTS Albums;');
  await dml('DROP TABLE IF EXISTS Artists;');
  await dml('CREATE TABLE Artists LIKE music.Artists;');
  await dml('CREATE TABLE Albums LIKE music.Albums;');
  await dml('CREATE TABLE Songs LIKE music.Songs;');
  await dml('CREATE TABLE ArtistAliases LIKE music.ArtistAliases;');
  await dml('CREATE TABLE AlbumSongs LIKE music.AlbumSongs;');
  await dml('CREATE TABLE SongArtists LIKE music.SongArtists;');
  await dml('CREATE TABLE AlbumArtists LIKE music.AlbumArtists;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS ArtistAliases;');
  await dml('DROP TABLE IF EXISTS ArtistRelations;');
  await dml('DROP TABLE IF EXISTS SongArtists;');
  await dml('DROP TABLE IF EXISTS AlbumArtists;');
  await dml('DROP TABLE IF EXISTS AlbumSongs;');
  await dml('DROP TABLE IF EXISTS Songs;');
  await dml('DROP TABLE IF EXISTS Albums;');
  await dml('DROP TABLE IF EXISTS Artists;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE Artists;');
  await dml('TRUNCATE TABLE Albums;');
  await dml('TRUNCATE TABLE Songs;');
  await dml('TRUNCATE TABLE ArtistAliases;');
  await dml('TRUNCATE TABLE AlbumSongs;');
  await dml('TRUNCATE TABLE SongArtists;');
  await dml('TRUNCATE TABLE AlbumArtists;');
});

const tag1 = {
  title: 'SongTitle',
  album: 'AlbumTitle',
  artist: ['Artist1'],
  artistNorm: ['Artist1Norm'],
  albumArtist: ['Artist2'],
  albumArtistNorm: ['Artist2Norm'],
  feat: ['Artist3'],
  featNorm: ['Artist3Norm'],
  year: 2000,
  month: 0,
  day: 1,
  time: 180,
  bitrate: 192,
  disk: 1,
  track: 1
};
const tag2 = {
  ...tag1,
  albumArtist: ['Artist1'],
  albumArtistNorm: ['Artist1'],
  feat: [],
  featNorm: []
};
const tag3 = {
  ...tag1,
  disk: 0
};
const tag4 = {
  ...tag1,
  albumArtist: ['Artist1', 'Artist2', 'Artist3'],
  albumArtistNorm: ['Artist1', 'Artist2Norm', 'Artist3Norm']
};

test.each([
  ['tag1', tag1, 3, 2],
  ['tag2', tag2, 1, 1],
  ['tag3', tag3, 3, 2],
  ['tag4', tag4, 3, 2]
])('new %s', async (name, tag, artistCount, songArtistCount) => {
  const [songId, newAlbum] = await upload(tag);
  expect(songId).toBe(1);
  expect(newAlbum).toBe(true);

  let rows = await query('SELECT * FROM Artists ORDER BY id');
  expect(rows.length).toBe(artistCount);

  for (let i = 0; i < artistCount; i += 1) {
    expect(rows[i].name).toBe(`Artist${i + 1}`);
    expect(rows[i].nameNorm).toBe(`Artist${i + 1}Norm`);
  }

  rows = await query('SELECT * FROM Albums ORDER BY id');
  expect(rows.length).toBe(1);
  let [row] = rows;
  expect(row.title).toBe(tag.album);
  expect(row.release).toStrictEqual(
    new Date(Date.UTC(tag.year, tag.month, tag.day))
  );
  expect(row.format).toBe(null);

  rows = await query('SELECT * FROM Songs ORDER BY id');
  expect(rows.length).toBe(1);
  [row] = rows;
  expect(row.title).toBe(tag.title);
  expect(row.time).toBe(tag.time);
  expect(row.bitrate).toBe(tag.bitrate);

  rows = await query('SELECT * FROM SongArtists ORDER BY ArtistId');
  expect(rows.length).toBe(songArtistCount);
  [row] = rows;
  expect(row.SongId).toBe(1);
  expect(row.order).toBe(0);
  if (row.feat) {
    expect([`Artist${row.ArtistId}`]).toStrictEqual(tag.feat);
  } else {
    expect([`Artist${row.ArtistId}`]).toStrictEqual(tag.artist);
  }

  rows = await query('SELECT * FROM AlbumArtists ORDER BY ArtistId');
  expect(rows.length).toBe(tag.albumArtist.length);
  expect(rows.map(r => `Artist${r.ArtistId}`)).toStrictEqual(tag.albumArtist);
  rows.forEach(r => {
    expect(r.AlbumId).toBe(1);
  });

  rows = await query('SELECT * FROM AlbumSongs ORDER BY disk, track');
  expect(rows.length).toBe(1);
  [row] = rows;
  expect(row.disk).toBe(1);
  expect(row.track).toBe(1);
  expect(row.SongId).toBe(1);
  expect(row.AlbumId).toBe(1);
});

test('existing artist', async () => {
  await dml(
    "INSERT INTO Artists (name, nameNorm) VAlUES ('Artist1', 'Artist1');"
  );

  const tag = tag2;
  const [songId, newAlbum] = await upload(tag);
  expect(songId).toBe(1);
  expect(newAlbum).toBe(true);

  let rows = await query('SELECT * FROM Artists ORDER BY id');
  expect(rows.length).toBe(1);

  rows = await query('SELECT * FROM SongArtists ORDER BY ArtistId');
  expect(rows.length).toBe(1);
  let [row] = rows;
  expect(row.SongId).toBe(1);
  expect(row.order).toBe(0);
  if (row.feat) {
    expect([`Artist${row.ArtistId}`]).toStrictEqual(tag.feat);
  } else {
    expect([`Artist${row.ArtistId}`]).toStrictEqual(tag.artist);
  }

  rows = await query('SELECT * FROM AlbumArtists ORDER BY ArtistId');
  expect(rows.length).toBe(1);
  [row] = rows;
  expect([`Artist${row.ArtistId}`]).toStrictEqual(tag.albumArtist);
  expect(row.AlbumId).toBe(1);
});

test('existing album', async () => {
  await dml(
    "INSERT INTO Artists (name, nameNorm) VAlUES ('Artist1', 'Artist1');"
  );
  await dml(
    "INSERT INTO Albums (title, `release`, format) VAlUES ('AlbumTitle', '2000-01-01', NULL);"
  );
  await dml('INSERT INTO AlbumArtists VAlUES (0, 1, 1);');

  const tag = tag2;
  const [songId, newAlbum] = await upload(tag);
  expect(songId).toBe(1);
  expect(newAlbum).toBe(false);

  let rows = await query('SELECT * FROM Artists ORDER BY id');
  expect(rows.length).toBe(1);

  rows = await query('SELECT * FROM Albums ORDER BY id');
  expect(rows.length).toBe(1);
});
