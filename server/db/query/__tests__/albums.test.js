const Albums = require('../albums.js');

const indexes = [1, 2, 3, 4, 5];
const albumIds = [1, 10, 25, 77, 100];
const albumRows = new Map([
  [
    1,
    {
      id: 1,
      title: 'Pink LUV',
      format: 'EP',
      format2: null,
      release: new Date('2014-11-24T00:00:00.000Z')
    }
  ],
  [
    10,
    {
      id: 10,
      title: 'Four',
      format: 'Studio',
      format2: null,
      release: new Date('2014-11-18T00:00:00.000Z')
    }
  ],
  [
    25,
    {
      id: 25,
      title: 'K팝 스타 시즌4 - 캐스팅 오디션 Part 1',
      format: 'Single',
      format2: 'Soundtrack',
      release: new Date('2015-01-18T00:00:00.000Z')
    }
  ],
  [
    77,
    {
      id: 77,
      title: '소유X어반자카파 (권순일&박용인) `틈`',
      format: 'Single',
      format2: null,
      release: new Date('2014-09-26T00:00:00.000Z')
    }
  ],
  [
    100,
    {
      id: 100,
      title: 'Me And My Broken Heart',
      format: 'EP',
      format2: null,
      release: new Date('2014-05-14T00:00:00.000Z')
    }
  ]
]);

test.each(indexes)('get %d details', async count => {
  const ids = albumIds.slice(0, count);
  const rows = await Albums.getDetails(ids);

  rows.forEach(row => {
    expect(row).toEqual(albumRows.get(row.id));
  });
});

test.each(indexes)('add %d details', async count => {
  const albums = albumIds.slice(0, count).map(a => ({ id: a }));
  await Albums.addDetails(albums);

  albums.forEach(album => {
    expect(album).toEqual(albumRows.get(album.id));
  });
});

const albumArtists = new Map([
  [1, [{ id: 1, name: 'Apink' }]],
  [10, [{ id: 58, name: 'One Direction' }]],
  [25, [{ id: 1301, name: 'K팝 스타' }]],
  [
    77,
    [
      {
        id: 137,
        name: '소유',
        Bs: new Map([['m', { id: 136, name: '씨스타' }]])
      },
      {
        id: 257,
        name: '권순일',
        Bs: new Map([['m', { id: 259, name: '어반 자카파' }]])
      },
      {
        id: 258,
        name: '박용인',
        Bs: new Map([['m', { id: 259, name: '어반 자카파' }]])
      }
    ]
  ],
  [100, [{ id: 300, name: 'Rixton' }]]
]);

test('map artists', async () => {
  const map = await Albums.mapArtists(albumIds);

  map.forEach((value, key) => {
    expect(value).toEqual(albumArtists.get(key));
  });
});

test.each(indexes)('add %d artists', async count => {
  const albums = albumIds.slice(0, count).map(a => ({ id: a }));
  await Albums.addArtists(albums);

  albums.forEach(album => {
    expect(album.artists).toEqual(albumArtists.get(album.id));
  });
});

const albumSongs = new Map([
  [
    1,
    [
      { id: 1, disk: 1, track: 1 },
      { id: 5, disk: 1, track: 2 },
      { id: 4, disk: 1, track: 3 },
      { id: 3, disk: 1, track: 4 },
      { id: 2, disk: 1, track: 5 }
    ]
  ],
  [
    10,
    [
      { id: 78, disk: 1, track: 1 },
      { id: 89, disk: 1, track: 2 },
      { id: 88, disk: 1, track: 3 },
      { id: 87, disk: 1, track: 4 },
      { id: 86, disk: 1, track: 5 },
      { id: 85, disk: 1, track: 6 },
      { id: 84, disk: 1, track: 7 },
      { id: 83, disk: 1, track: 8 },
      { id: 82, disk: 1, track: 9 },
      { id: 81, disk: 1, track: 10 },
      { id: 80, disk: 1, track: 11 },
      { id: 79, disk: 1, track: 12 }
    ]
  ],
  [25, [{ id: 197, disk: 1, track: 1 }]],
  [77, [{ id: 449, disk: 1, track: 1 }]],
  [
    100,
    [
      { id: 555, disk: 1, track: 1 },
      { id: 558, disk: 1, track: 2 },
      { id: 557, disk: 1, track: 3 },
      { id: 556, disk: 1, track: 4 }
    ]
  ]
]);

test('map songs', async () => {
  const map = await Albums.mapSongs(albumIds);

  map.forEach((value, key) => {
    expect(value).toEqual(albumSongs.get(key));
  });
});
