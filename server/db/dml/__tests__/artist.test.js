const { dml, query } = require('@eunmo/mysql');
const { findOrCreate, update } = require('../artist.js');

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS ArtistAliases;');
  await dml('DROP TABLE IF EXISTS Artists;');
  await dml('CREATE TABLE Artists LIKE music.Artists;');
  await dml('CREATE TABLE ArtistAliases LIKE music.ArtistAliases;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS ArtistAliases;');
  await dml('DROP TABLE IF EXISTS Artists;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE Artists;');
  await dml('TRUNCATE TABLE ArtistAliases;');
  await dml("INSERT INTO Artists (name, nameNorm) VAlUES ('a', 'a');");
  await dml("INSERT INTO Artists (name, nameNorm) VAlUES ('b_', 'b');");
  await dml("INSERT INTO Artists (name, nameNorm) VAlUES ('c', 'd');");
  await dml(
    "INSERT INTO ArtistAliases (alias, chart, ArtistId) VAlUES ('e', 'upload', 1);"
  );

  let rows = await query('SELECT * FROM Artists');
  expect(rows.length).toBe(3);

  rows = await query('SELECT * FROM ArtistAliases');
  expect(rows.length).toBe(1);
});

test('get alias', async () => {
  const id = await findOrCreate('e', 'e');
  expect(id).toBe(1);
});

test.each([
  ['a', 'a', 1],
  ['b', 'b', 2],
  ['b_', 'b_', 2],
  ['c', 'c', 3],
  ['c', 'd', 3],
  ['d', 'd', 3],
])('get %s', async (name, nameNorm, expected) => {
  const id = await findOrCreate(name, nameNorm);
  expect(id).toBe(expected);
});

test('get new ID', async () => {
  const id = await findOrCreate('f', 'f');
  expect(id).toBe(4);

  const rows = await query('SELECT * FROM Artists WHERE id=4');
  expect(rows.length).toBe(1);
});

test.each([
  ['Korea', 'Solo', 'Male', true, 1],
  ['Korea', 'Solo', 'Male', false, null],
  ['Korea', 'Solo', null, true, 1],
  ['Korea', 'Solo', null, false, null],
  ['Korea', null, 'Male', true, 1],
  ['Korea', null, 'Male', false, null],
  ['Korea', null, null, true, 1],
  ['Korea', null, null, false, null],
  [null, 'Solo', 'Male', true, 1],
  [null, 'Solo', 'Male', false, null],
  [null, 'Solo', null, true, 1],
  [null, 'Solo', null, false, null],
  [null, null, 'Male', true, 1],
  [null, null, 'Male', false, null],
  [null, null, null, true, 1],
  [null, null, null, false, null],
])('update', async (origin, type, gender, favorites, expectedF) => {
  const result = await update(1, origin, type, gender, favorites);
  expect(result).toBe(
    [origin, type, gender, expectedF].some((x) => x !== null)
  );

  const rows = await query('SELECT * FROM Artists WHERE id=1;');
  expect(rows.length).toBe(1);
  const row = rows[0];
  expect(row.origin).toBe(origin);
  expect(row.type).toBe(type);
  expect(row.gender).toBe(gender);
  expect(row.favorites).toBe(expectedF);
});
