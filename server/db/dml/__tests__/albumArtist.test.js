const { dml, query } = require('../../query.js');
const { add, remove, update } = require('../albumArtist.js');

jest.mock('../../db.json', () => {
  return {
    host: 'localhost',
    user: 'music',
    password: 'music',
    database: 'musictest'
  };
});

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS AlbumArtists;');
  await dml('CREATE TABLE AlbumArtists LIKE music.AlbumArtists;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS AlbumArtists;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE AlbumArtists;');
  await dml('INSERT INTO AlbumArtists VAlUES (0, 1, 2);');

  const rows = await query('SELECT * FROM AlbumArtists');
  expect(rows.length).toBe(1);
});

test('add', async () => {
  await add(1, 2, 3);

  const rows = await query('SELECT * FROM AlbumArtists WHERE ArtistId=3');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.order).toBe(1);
  expect(row.ArtistId).toBe(3);
  expect(row.AlbumId).toBe(2);
});

test('remove', async () => {
  await remove(2, 1);

  const rows = await query('SELECT * FROM AlbumArtists');
  expect(rows.length).toBe(0);
});

test.each([0, 1])('update', async order => {
  const result = await update(order, 2, 1);
  expect(result).toBe(order !== 0);

  const rows = await query('SELECT * FROM AlbumArtists');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.order).toBe(order);
});
