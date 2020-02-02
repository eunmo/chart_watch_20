const { dml, query } = require('../../query.js');
const { merge } = require('../artist.js');

jest.mock('../../db.json', () => {
  return {
    host: 'localhost',
    user: 'music',
    password: 'music',
    database: 'musictest'
  };
});

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS ArtistAliases;');
  await dml('DROP TABLE IF EXISTS ArtistRelations;');
  await dml('DROP TABLE IF EXISTS SongArtists;');
  await dml('DROP TABLE IF EXISTS AlbumArtists;');
  await dml('DROP TABLE IF EXISTS Artists;');
  await dml('CREATE TABLE Artists LIKE music.Artists;');
  await dml('CREATE TABLE ArtistAliases LIKE music.ArtistAliases;');
  await dml('CREATE TABLE ArtistRelations LIKE music.ArtistRelations;');
  await dml('CREATE TABLE SongArtists LIKE music.SongArtists;');
  await dml('CREATE TABLE AlbumArtists LIKE music.AlbumArtists;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS ArtistAliases;');
  await dml('DROP TABLE IF EXISTS ArtistRelations;');
  await dml('DROP TABLE IF EXISTS SongArtists;');
  await dml('DROP TABLE IF EXISTS AlbumArtists;');
  await dml('DROP TABLE IF EXISTS Artists;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE Artists;');
  await dml('TRUNCATE TABLE ArtistAliases;');
  await dml('TRUNCATE TABLE ArtistRelations;');
  await dml('TRUNCATE TABLE SongArtists;');
  await dml('TRUNCATE TABLE AlbumArtists;');

  await dml("INSERT INTO Artists (name, nameNorm) VAlUES ('a', 'a');");
  await dml("INSERT INTO Artists (name, nameNorm) VAlUES ('b', 'b');");

  const rows = await query('SELECT * FROM Artists');
  expect(rows.length).toBe(2);
});

afterEach(async () => {
  let rows = await query('SELECT * FROM Artists');
  expect(rows.length).toBe(1);

  rows = await query('SELECT * FROM Artists WHERE id=1');
  expect(rows.length).toBe(0);
});

test('simple merge', async () => {
  await merge(2, 1);
});

test('merge artist alias', async () => {
  await dml(
    "INSERT INTO ArtistAliases (alias, chart, ArtistId) VAlUES ('e', 'upload', 1);"
  );
  await merge(2, 1);

  const rows = await query('SELECT * FROM ArtistAliases WHERE ArtistId=2');
  expect(rows.length).toBe(1);
});

test('merge artist relation a', async () => {
  await dml("INSERT INTO ArtistRelations (a, b, type) VAlUES (1, 3, 'm');");
  await merge(2, 1);

  const rows = await query('SELECT * FROM ArtistRelations WHERE a=2');
  expect(rows.length).toBe(1);
});

test('merge artist relation b', async () => {
  await dml("INSERT INTO ArtistRelations (a, b, type) VAlUES (3, 1, 'm');");
  await merge(2, 1);

  const rows = await query('SELECT * FROM ArtistRelations WHERE b=2');
  expect(rows.length).toBe(1);
});

test('merge song artist', async () => {
  await dml('INSERT INTO SongArtists (SongId, ArtistId) VAlUES (1, 1);');
  await merge(2, 1);

  const rows = await query('SELECT * FROM SongArtists WHERE ArtistId=2');
  expect(rows.length).toBe(1);
});

test('merge album artist', async () => {
  await dml('INSERT INTO AlbumArtists (AlbumId, ArtistId) VAlUES (1, 1);');
  await merge(2, 1);

  const rows = await query('SELECT * FROM AlbumArtists WHERE ArtistId=2');
  expect(rows.length).toBe(1);
});

test('merge all', async () => {
  await dml(
    "INSERT INTO ArtistAliases (alias, chart, ArtistId) VAlUES ('e', 'upload', 1);"
  );
  await dml("INSERT INTO ArtistRelations (a, b, type) VAlUES (1, 3, 'm');");
  await dml("INSERT INTO ArtistRelations (a, b, type) VAlUES (3, 1, 'm');");
  await dml('INSERT INTO AlbumArtists (AlbumId, ArtistId) VAlUES (1, 1);');
  await dml('INSERT INTO SongArtists (SongId, ArtistId) VAlUES (1, 1);');
  await merge(2, 1);

  let rows = await query('SELECT * FROM ArtistAliases WHERE ArtistId=2');
  expect(rows.length).toBe(1);

  rows = await query('SELECT * FROM ArtistRelations WHERE a=2');
  expect(rows.length).toBe(1);

  rows = await query('SELECT * FROM ArtistRelations WHERE b=2');
  expect(rows.length).toBe(1);

  rows = await query('SELECT * FROM SongArtists WHERE ArtistId=2');
  expect(rows.length).toBe(1);

  rows = await query('SELECT * FROM AlbumArtists WHERE ArtistId=2');
  expect(rows.length).toBe(1);
});
