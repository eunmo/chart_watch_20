const { dml, query } = require('@eunmo/mysql');
const { add, update } = require('../album.js');

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS Albums;');
  await dml('CREATE TABLE Albums LIKE music.Albums;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS Albums;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE Albums;');
  await dml(
    "INSERT INTO Albums (title, `release`, format) VAlUES ('a', '2000-01-01', NULL);"
  );

  const rows = await query('SELECT * FROM Albums');
  expect(rows.length).toBe(1);
});

const oldDate = new Date(Date.UTC(2000, 0, 1));
const newDate = new Date(Date.UTC(2020, 1, 2));

test.each([
  ['b', newDate, null],
  ['b', newDate, 'Single'],
])('add', async (title, release, format) => {
  const id = await add(title, release, format);
  expect(id).toBe(2);

  const rows = await query('SELECT * FROM Albums WHERE id=2');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.title).toBe(title);
  expect(row.release).toStrictEqual(release);
  expect(row.format).toBe(format);
});

test.each([
  ['b', newDate, 'Single', 'Deluxe'],
  ['b', newDate, 'Single', null],
  ['b', newDate, null, 'Deluxe'],
  ['b', newDate, null, null],
])('update', async (title, release, format, format2) => {
  const result = await update(1, title, release, format, format2);
  expect(result).toBe(true);

  const rows = await query('SELECT * FROM Albums WHERE id=1;');
  expect(rows.length).toBe(1);
  const row = rows[0];
  expect(row.title).toBe(title);
  expect(row.release).toStrictEqual(release);
  expect(row.format).toBe(format);
  expect(row.format2).toBe(format2);
});

test('update no change', async () => {
  const result = await update(1, 'a', oldDate, null, null);
  expect(result).toBe(false);
});
