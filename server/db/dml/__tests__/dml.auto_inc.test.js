const { dml, query } = require('../../query.js');

jest.mock('../../db.json', () => {
  return {
    host: 'localhost',
    user: 'music',
    password: 'music',
    database: 'musictest',
  };
});

beforeEach(async () => {
  await dml('DROP TABLE IF EXISTS test;');
  await dml(`
    CREATE TABLE test (
      a int(11) NOT NULL AUTO_INCREMENT,
      b varchar(255),
      PRIMARY KEY (a)
    );`);
  await dml("INSERT INTO test VAlUES (1,'a');");

  const rows = await query('SELECT * FROM test');
  expect(rows.length).toBe(1);
});

afterEach(async () => {
  await dml('DROP TABLE IF EXISTS test;');
});

test('can insert', async () => {
  const result = await dml("INSERT INTO test VAlUES (DEFAULT,'b');");
  expect(result.affectedRows).toBe(1);
  expect(result.insertId).toBe(2);

  let rows = await query('SELECT * FROM test');
  expect(rows.length).toBe(2);

  rows = await query('SELECT * FROM test WHERE a=2');
  expect(rows.length).toBe(1);
});

test('pk error by insert', async () => {
  try {
    await dml("INSERT INTO test VAlUES (1,'b');");
  } catch (e) {
    expect(e.code).toMatch('ER_DUP_ENTRY');
  }
});

test('pk error by update', async () => {
  const result = await dml("INSERT INTO test VAlUES (DEFAULT,'b');");
  expect(result.affectedRows).toBe(1);
  expect(result.insertId).toBe(2);

  try {
    await dml('UPDATE test set a=2;');
  } catch (e) {
    expect(e.code).toMatch('ER_DUP_ENTRY');
  }
});
