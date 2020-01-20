const Albums = require('../albums.js');

const indexes = [1, 2, 3, 4];
const albumIds = [1, 10, 30, 100];
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
    30,
    {
      id: 30,
      title: 'K팝 스타 시즌4 `마음대로`',
      format: 'Single',
      format2: 'Soundtrack',
      release: new Date('2014-12-14T00:00:00.000Z')
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
