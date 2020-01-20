const { query } = require('../query.js');

test('can query', async () => {
  const rows = await query('SELECT COUNT(*) c FROM Songs;');
  expect(rows[0].c).toBeGreaterThan(30000);
});

test('syntax error', async () => {
  try {
    const rows = await query('SELECT COUNT(* c FROM Songs;');
  } catch (e) {
    expect(e.code).toMatch('ER_PARSE_ERROR');
  }
});
