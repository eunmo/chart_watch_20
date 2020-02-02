const Artists = require('../artists.js');

const indexes = [1, 2, 3, 4];
const artistIds = [1, 10, 100, 317];
const artistNames = new Map([
  [1, { id: 1, name: 'Apink', nameNorm: 'Apink' }],
  [10, { id: 10, name: 'Zedd', nameNorm: 'Zedd' }],
  [100, { id: 100, name: '10cm', nameNorm: '10cm' }],
  [317, { id: 317, name: '정은지', nameNorm: '정은지' }]
]);

test.each(indexes)('get %d names', async count => {
  const ids = artistIds.slice(0, count);
  const rows = await Artists.getNames(ids);

  expect(rows.length).toBe(count);
  rows.forEach(row => {
    expect(row).toEqual(artistNames.get(row.id));
  });
});

test.each(indexes)('add %d names', async count => {
  const artists = artistIds.slice(0, count).map(a => ({ id: a }));
  await Artists.addNames(artists);

  artists.forEach(artist => {
    expect(artist).toEqual(artistNames.get(artist.id));
  });
});

const artistDetails = new Map([
  [1, { name: 'Apink', gender: 'Female', type: 'Group', origin: 'Korea' }],
  [10, { name: 'Zedd', gender: 'Male', type: 'Solo', origin: 'Russia' }],
  [100, { name: '10cm', gender: 'Male', type: 'Duet', origin: 'Korea' }],
  [317, { name: '정은지', gender: 'Female', type: 'Solo', origin: 'Korea' }]
]);

test.each(artistIds)('get %d details', async id => {
  const rows = await Artists.getDetail(id);

  expect(rows.length).toBe(1);
  rows.forEach(row => {
    expect(row).toEqual(artistDetails.get(id));
  });
});

const artistAs = new Map([
  ['1.317', { id: 317, type: 'm', order: null, name: '정은지' }],
  ['100.769', { id: 769, type: 'p', order: 1, name: '센치한 하하' }],
  ['100.798', { id: 798, type: 'm', order: null, name: '권정열' }]
]);

test.each(artistIds)('get %d A', async id => {
  const rows = await Artists.getA(id);

  rows.forEach(row => {
    expect(row).toEqual(artistAs.get(`${id}.${row.id}`));
  });
});

const artistBs = new Map([[317, new Map([['m', { id: 1, name: 'Apink' }]])]]);

test('map Bs', async () => {
  const map = await Artists.mapBs(artistIds);

  map.forEach((value, key) => {
    expect(value).toEqual(artistBs.get(key));
  });
});

const artistAlbumsAndSongsCount = new Map([
  [1, 49],
  [2, 66],
  [3, 89],
  [4, 105]
]);

test.each(indexes)('get %d albums and songs', async count => {
  const ids = artistIds.slice(0, count);
  const rows = await Artists.getAlbumsAndSongs(ids);

  expect(rows.length).toBe(artistAlbumsAndSongsCount.get(count));
});
