const { dml, query } = require('../../query.js');
const { add, remove, update } = require('../artistAlias.js');

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
  await dml('CREATE TABLE ArtistAliases LIKE music.ArtistAliases;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS ArtistAliases;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE ArtistAliases;');
  await dml(
    "INSERT INTO ArtistAliases (alias, chart, ArtistId) VAlUES ('a', 'upload', 1);"
  );

  const rows = await query('SELECT * FROM ArtistAliases');
  expect(rows.length).toBe(1);
});

test('add', async () => {
  const id = await add('b', 'uk', 2);
  expect(id).toBe(2);

  const rows = await query('SELECT * FROM ArtistAliases WHERE id=2');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.alias).toBe('b');
  expect(row.chart).toBe('uk');
  expect(row.ArtistId).toBe(2);
});

test('remove', async () => {
  await remove(1);

  const rows = await query('SELECT * FROM ArtistAliases');
  expect(rows.length).toBe(0);
});

test.each([
  ['a', 'upload'],
  ['b', 'upload'],
  ['a', 'uk'],
  ['b', 'uk']
])('update', async (alias, chart) => {
  const result = await update(1, alias, chart);
  expect(result).toBe(alias !== 'a' || chart !== 'upload');

  const rows = await query('SELECT * FROM ArtistAliases WHERE id=1');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.alias).toBe(alias);
  expect(row.chart).toBe(chart);
});
