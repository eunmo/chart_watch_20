const { dml, query } = require('../../query.js');
const { add, remove, update } = require('../artistRelation.js');

jest.mock('../../db.json', () => {
  return {
    host: 'localhost',
    user: 'music',
    password: 'music',
    database: 'musictest'
  };
});

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS ArtistRelations;');
  await dml('CREATE TABLE ArtistRelations LIKE music.ArtistRelations;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS ArtistRelations;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE ArtistRelations;');
  await dml(
    "INSERT INTO ArtistRelations (type, `order`, A, B) VAlUES ('m', null, 1, 2);"
  );

  const rows = await query('SELECT * FROM ArtistRelations');
  expect(rows.length).toBe(1);
});

test.each([
  ['p', 0, 1],
  ['m', null, 2]
])('add', async (type, order, A) => {
  await add(type, order, A, 3);

  const rows = await query('SELECT * FROM ArtistRelations WHERE B=3');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.type).toBe(type);
  expect(row.order).toBe(order);
  expect(row.A).toBe(A);
});

test('remove', async () => {
  await remove(1, 2);

  const rows = await query('SELECT * FROM ArtistRelations');
  expect(rows.length).toBe(0);
});

test.each([
  ['p', 0],
  ['a', null],
  ['m', null]
])('update', async (type, order) => {
  const result = await update(type, order, 1, 2);
  expect(result).toBe(type !== 'm' || order !== null);

  const rows = await query('SELECT * FROM ArtistRelations');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.type).toBe(type);
  expect(row.order).toBe(order);
});
