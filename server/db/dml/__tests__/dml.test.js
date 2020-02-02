const { dml, query } = require('../dml.js');

jest.mock('../../db.json', () => {
  return {
    host: 'localhost',
    user: 'music',
    password: 'music',
    database: 'musictest'
  };
});

beforeEach(async () => {
  await dml('DROP TABLE IF EXISTS test;');
  await dml('CREATE TABLE test (a int(11), b varchar(255));');
  await dml("INSERT INTO test VAlUES (1,'a');");

  const rows = await query('SELECT * FROM test');
  expect(rows.length).toBe(1);
});

afterEach(async () => {
  await dml('DROP TABLE IF EXISTS test;');
});

test('can insert', async () => {
  const result = await dml("INSERT INTO test VAlUES (2,'b');");
  expect(result.affectedRows).toBe(1);

  let rows = await query('SELECT * FROM test');
  expect(rows.length).toBe(2);

  rows = await query('SELECT * FROM test WHERE a=2');
  expect(rows.length).toBe(1);
});

test('can update', async () => {
  const result = await dml('UPDATE test set a=2;');
  expect(result.affectedRows).toBe(1);
  expect(result.changedRows).toBe(1);

  let rows = await query('SELECT * FROM test');
  expect(rows.length).toBe(1);

  rows = await query('SELECT * FROM test WHERE a=1');
  expect(rows.length).toBe(0);

  rows = await query('SELECT * FROM test WHERE a=2');
  expect(rows.length).toBe(1);
});

test('can delete', async () => {
  const result = await dml('DELETE FROM test;');
  expect(result.affectedRows).toBe(1);

  const rows = await query('SELECT * FROM test');
  expect(rows.length).toBe(0);
});
