const Artists = require('../artists.js');

const indexes = [1, 2, 3];
const artistIds = [1, 10, 100];
const artistRows = new Map([
  [1, { id: 1, name: 'Apink', nameNorm: 'Apink' }],
  [10, { id: 10, name: 'Zedd', nameNorm: 'Zedd' }],
  [100, { id: 100, name: '10cm', nameNorm: '10cm' }]
]);

const artistRows2 = new Map([
  [1, { name: 'Apink', gender: 'Female', type: 'Group', origin: 'Korea' }],
  [10, { name: 'Zedd', gender: 'Male', type: 'Solo', origin: 'Russia' }],
  [100, { name: '10cm', gender: 'Male', type: 'Duet', origin: 'Korea' }]
]);

test.each(indexes)('get %d details', async count => {
  const ids = artistIds.slice(0, count);
  const rows = await Artists.getNames(ids);

  rows.forEach(row => {
    expect(row).toEqual(artistRows.get(row.id));
  });
});

test.each(artistIds)('get %d details', async id => {
  const rows = await Artists.getDetail(id);

  expect(rows.length).toBe(1);
  rows.forEach(row => {
    expect(row).toEqual(artistRows2.get(id));
  });
});
