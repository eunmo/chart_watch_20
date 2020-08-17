const { dml, query } = require('@eunmo/mysql');
const { add, recordPlay, update } = require('../song.js');

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS Songs;');
  await dml('CREATE TABLE Songs LIKE music.Songs;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS Songs;');
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE Songs;');
  await dml("INSERT INTO Songs (title, time, bitrate) VAlUES ('a', 180, 192);");

  const rows = await query('SELECT * FROM Songs');
  expect(rows.length).toBe(1);
});

test.each([['b', 60, 128]])('add', async (title, time, bitrate) => {
  const id = await add(title, time, bitrate);
  expect(id).toBe(2);

  const rows = await query('SELECT * FROM Songs WHERE id=2');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.title).toBe(title);
  expect(row.time).toBe(time);
  expect(row.bitrate).toBe(bitrate);
  expect(row.plays).toBe(0);
});

test.each([
  ['a', 0],
  ['a', 1],
  ['b', 0],
  ['b', 1],
])('update', async (title, plays) => {
  const result = await update(1, title, plays);
  expect(result).toBe(title !== 'a' || plays !== 0);

  const rows = await query('SELECT * FROM Songs WHERE id=1');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.title).toBe(title);
  expect(row.plays).toBe(plays);
});

test('record play', async () => {
  const now = new Date();
  now.setMilliseconds(0);
  const result = await recordPlay(1, 1, now);
  expect(result).toBe(true);

  const rows = await query('SELECT * FROM Songs WHERE id=1');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.plays).toBe(1);
  expect(row.lastPlayed).toStrictEqual(now);
});
