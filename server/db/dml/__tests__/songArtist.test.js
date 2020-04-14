const { dml, query } = require('../../query.js');
const { add, remove, update } = require('../songArtist.js');

jest.mock('../../db.json', () => {
  return {
    host: 'localhost',
    user: 'music',
    password: 'music',
    database: 'musictest',
  };
});

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS SongArtists;');
  await dml('CREATE TABLE SongArtists LIKE music.SongArtists;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS SongArtists;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE SongArtists;');
  await dml('INSERT INTO SongArtists VAlUES (0, 0, 100, 200);');

  const rows = await query('SELECT * FROM SongArtists');
  expect(rows.length).toBe(1);
});

test.each([
  [0, 0, 0, 100],
  [1, 0, 0, 100],
  [0, 1, 1, 100],
  [1, 1, 1, 100],
  [0, false, 0, 100],
  [1, false, 0, 100],
  [0, true, 1, 100],
  [1, true, 1, 100],
])('add', async (order, feat, expF, song) => {
  await add(order, feat, song, 201);

  const rows = await query('SELECT * FROM SongArtists WHERE ArtistId=201');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.order).toBe(order);
  expect(row.feat).toBe(expF);
  expect(row.ArtistId).toBe(201);
  expect(row.SongId).toBe(song);
});

test('remove', async () => {
  await remove(100, 200);

  const rows = await query('SELECT * FROM SongArtists');
  expect(rows.length).toBe(0);
});

test.each([
  [0, 0, 0, 100],
  [1, 0, 0, 100],
  [0, 1, 1, 100],
  [1, 1, 1, 100],
  [0, false, 0, 100],
  [1, false, 0, 100],
  [0, true, 1, 100],
  [1, true, 1, 100],
])('update', async (order, feat, expF, song) => {
  const result = await update(order, feat, song, 200);
  expect(result).toBe(order !== 0 || expF !== 0);

  const rows = await query('SELECT * FROM SongArtists');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.order).toBe(order);
  expect(row.feat).toBe(expF);
  expect(row.ArtistId).toBe(200);
  expect(row.SongId).toBe(song);
});
