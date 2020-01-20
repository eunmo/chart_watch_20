const Songs = require('../songs.js');

const indexes = [1, 2, 3, 4, 5, 6];
const songIds = [1, 10, 44, 100, 300, 381];
const songRows = new Map([
  [1, { id: 1, title: 'LUV', plays: 74 }],
  [10, { id: 10, title: 'Love Me Harder', plays: 11 }],
  [44, { id: 44, title: 'Rather Be', plays: 44 }],
  [100, { id: 100, title: 'Side 3, Part 2: On Noodle Street', plays: 8 }],
  [300, { id: 300, title: 'New Romantics', plays: 19 }],
  [381, { id: 381, title: 'BORN HATER', plays: 24 }]
]);
const songArtists = new Map([
  ['1.0', { ArtistId: 1, SongId: 1, feat: 0, name: 'Apink', order: 0 }],
  [
    '10.0',
    { ArtistId: 3, SongId: 10, feat: 0, name: 'Ariana Grande', order: 0 }
  ],
  ['10.1', { ArtistId: 6, SongId: 10, feat: 0, name: 'The Weeknd', order: 1 }],
  [
    '44.0',
    { ArtistId: 27, SongId: 44, feat: 0, name: 'Clean Bandit', order: 0 }
  ],
  [
    '100.0',
    { ArtistId: 60, SongId: 100, feat: 0, name: 'Pink Floyd', order: 0 }
  ],
  [
    '300.0',
    { ArtistId: 191, SongId: 300, feat: 0, name: 'Taylor Swift', order: 0 }
  ],
  ['381.0', { ArtistId: 224, SongId: 381, feat: 0, name: '에픽하이', order: 0 }]
]);
const songFeatures = new Map([
  [
    '44.0',
    { ArtistId: 38, SongId: 44, feat: 1, name: 'Jess Glynne', order: 0 }
  ],
  ['381.0', { ArtistId: 108, SongId: 381, feat: 1, name: '빈지노', order: 0 }],
  [
    '381.1',
    { ArtistId: 117, SongId: 381, feat: 1, name: '버벌진트', order: 1 }
  ],
  ['381.2', { ArtistId: 229, SongId: 381, feat: 1, name: 'B.I', order: 2 }],
  ['381.3', { ArtistId: 228, SongId: 381, feat: 1, name: '송민호', order: 3 }],
  ['381.4', { ArtistId: 177, SongId: 381, feat: 1, name: 'BOBBY', order: 4 }]
]);
const songArtistMap = new Map([
  [1, { artists: [1], features: [] }],
  [10, { artists: [3, 6], features: [] }],
  [44, { artists: [27], features: [38] }],
  [100, { artists: [60], features: [] }],
  [300, { artists: [191], features: [] }],
  [381, { artists: [224], features: [108, 117, 229, 228, 177] }],
  [1000, { artists: [443], features: [] }]
]);
const songAlbums = new Map([
  [
    '1.1',
    { AlbumId: 1, SongId: 1, release: new Date('2014-11-24T00:00:00.000Z') }
  ],
  [
    '10.2',
    { AlbumId: 2, SongId: 10, release: new Date('2014-08-22T00:00:00.000Z') }
  ],
  [
    '44.5',
    { AlbumId: 5, SongId: 44, release: new Date('2014-05-29T00:00:00.000Z') }
  ],
  [
    '44.1691',
    { AlbumId: 1691, SongId: 44, release: new Date('2015-08-21T00:00:00.000Z') }
  ],
  [
    '100.11',
    { AlbumId: 11, SongId: 100, release: new Date('2014-11-07T00:00:00.000Z') }
  ],
  [
    '300.50',
    { AlbumId: 50, SongId: 300, release: new Date('2014-10-27T00:00:00.000Z') }
  ],
  [
    '381.62',
    { AlbumId: 62, SongId: 381, release: new Date('2014-10-21T00:00:00.000Z') }
  ]
]);
const songAlbumIds = new Map([
  [1, [{ id: 1, disk: 1, track: 1 }]],
  [10, [{ id: 2, disk: 1, track: 9 }]],
  [
    44,
    [
      { id: 5, disk: 1, track: 4 },
      { id: 1691, disk: 1, track: 9 }
    ]
  ],
  [100, [{ id: 11, disk: 1, track: 9 }]],
  [300, [{ id: 50, disk: 1, track: 16 }]],
  [381, [{ id: 62, disk: 1, track: 8 }]]
]);
const songOldestAlbumIds = new Map([
  [1, 1],
  [10, 2],
  [44, 5],
  [100, 11],
  [300, 50],
  [381, 62]
]);
const songMinRanks = new Map([
  [1, 1],
  [10, 7],
  [44, 1],
  [381, 2]
]);

test.each(indexes)('get %d details', async count => {
  const ids = songIds.slice(0, count);
  const rows = await Songs.getDetails(ids);

  rows.forEach(row => {
    expect(row).toEqual(songRows.get(row.id));
  });
});

test.each([1, 2, 3, 4, 5])('get %d artists', async count => {
  const ids = songIds.slice(0, count);
  const rows = await Songs.getArtists(ids);

  rows.forEach(row => {
    const map = row.feat ? songFeatures : songArtists;
    expect(row).toEqual(map.get(`${row.SongId}.${row.order}`));
  });
});

test('map artists', async () => {
  const map = await Songs.mapArtists(songIds);
  map.forEach((value, key) => {
    expect(value.artists.map(a => a.id)).toEqual(
      songArtistMap.get(key).artists
    );
    expect(value.features.map(a => a.id)).toEqual(
      songArtistMap.get(key).features
    );
  });
});

test.each([1, 2, 3, 4, 5])('get %d albums', async count => {
  const ids = songIds.slice(0, count);
  const rows = await Songs.getAlbums(ids);

  rows.forEach(row => {
    expect(row).toEqual(songAlbums.get(`${row.SongId}.${row.AlbumId}`));
  });
});

test.each([1, 2, 3, 4, 5])('get %d album ids', async count => {
  const ids = songIds.slice(0, count);
  const map = await Songs.mapAlbumIds(ids);

  map.forEach((value, key) => {
    expect(value).toEqual(songAlbumIds.get(key));
  });
});

test.each([1, 2, 3, 4, 5])('add %d details', async count => {
  const songs = songIds.slice(0, count).map(s => ({ id: s }));
  await Songs.addDetails(songs);

  songs.forEach(song => {
    expect(song).toEqual(songRows.get(song.id));
  });
});

test.each([1, 2, 3, 4, 5])('add %d artists', async count => {
  const songs = songIds.slice(0, count).map(s => ({ id: s }));
  await Songs.addArtists(songs);

  songs.forEach(song => {
    expect(song.artists.length).toBe(songArtistMap.get(song.id).artists.length);
    expect(song.features.length).toBe(
      songArtistMap.get(song.id).features.length
    );
  });
});

test.each([1, 2, 3, 4, 5])('add %d albums', async count => {
  const songs = songIds.slice(0, count).map(s => ({ id: s }));
  await Songs.addAlbum(songs);

  songs.forEach(song => {
    expect(song.albumId).toBe(songOldestAlbumIds.get(song.id));
  });
});

test.each([1, 2, 3, 4, 5])('add %d min rank', async count => {
  const songs = songIds.slice(0, count).map(s => ({ id: s }));
  await Songs.addMinRank(songs);

  songs.forEach(song => {
    expect(song.minRank).toBe(songMinRanks.get(song.id));
  });
});

test.each([1, 2, 3, 4, 5])('add %d favorite', async count => {
  const songs = songIds.slice(0, count).map(s => ({ id: s }));
  await Songs.addFavorite(songs);

  songs.forEach(song => {
    expect(song.favorite).toBe(song.id === 300 ? true : undefined);
  });
});
