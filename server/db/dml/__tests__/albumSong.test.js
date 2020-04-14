const { dml, query } = require('../../query.js');
const { add } = require('../albumSong.js');

jest.mock('../../db.json', () => {
  return {
    host: 'localhost',
    user: 'music',
    password: 'music',
    database: 'musictest',
  };
});

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS AlbumSongs;');
  await dml('CREATE TABLE AlbumSongs LIKE music.AlbumSongs;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS AlbumSongs;');
});

test.each([[1, 2, 3, 4]])('add', async (disk, track, song, album) => {
  await add(disk, track, song, album);

  const rows = await query('SELECT * FROM AlbumSongs');
  expect(rows.length).toBe(1);

  const row = rows[0];
  expect(row.disk).toBe(disk);
  expect(row.track).toBe(track);
  expect(row.SongId).toBe(song);
  expect(row.AlbumId).toBe(album);
});
