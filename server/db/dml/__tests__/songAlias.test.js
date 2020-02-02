const { dml, query } = require('../../query.js');
const { add, remove, update } = require('../songAlias.js');

jest.mock('../../db.json', () => {
  return {
    host: 'localhost',
    user: 'music',
    password: 'music',
    database: 'musictest'
  };
});

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS SongAliases;');
  await dml('CREATE TABLE SongAliases LIKE music.SongAliases;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS SongAliases;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE SongAliases;');
  await dml(
    "INSERT INTO SongAliases (alias, chart, SongId) VAlUES ('a', 'gaon', 1);"
  );

  const rows = await query('SELECT * FROM SongAliases');
  expect(rows.length).toBe(1);
});

test('add', async () => {
  const id = await add('b', 'uk', 2);
  expect(id).toBe(2);

  const rows = await query('SELECT * FROM SongAliases WHERE id=2');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.alias).toBe('b');
  expect(row.chart).toBe('uk');
  expect(row.SongId).toBe(2);
});

test('remove', async () => {
  await remove(1);

  const rows = await query('SELECT * FROM SongAliases');
  expect(rows.length).toBe(0);
});

test.each([
  ['a', 'gaon'],
  ['b', 'gaon'],
  ['a', 'uk'],
  ['b', 'uk']
])('update', async (alias, chart) => {
  const result = await update(1, alias, chart);
  expect(result).toBe(alias !== 'a' || chart !== 'gaon');

  const rows = await query('SELECT * FROM SongAliases WHERE id=1');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.alias).toBe(alias);
  expect(row.chart).toBe(chart);
});
