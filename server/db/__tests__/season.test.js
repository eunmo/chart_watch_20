const Season = require('../season.js');
const { query } = require('../query.js');

test.each([
  [
    new Date(Date.UTC(2010, 0, 1)),
    "'2009-01-03T00:00:00.000Z','2008-01-05T00:00:00.000Z','2007-01-06T00:00:00.000Z','2006-01-07T00:00:00.000Z','2005-01-01T00:00:00.000Z','2004-01-03T00:00:00.000Z','2003-01-04T00:00:00.000Z','2002-01-05T00:00:00.000Z','2001-01-06T00:00:00.000Z','2000-01-01T00:00:00.000Z'"
  ],
  [
    new Date(Date.UTC(2010, 1, 1)),
    "'2009-02-07T00:00:00.000Z','2008-02-02T00:00:00.000Z','2007-02-03T00:00:00.000Z','2006-02-04T00:00:00.000Z','2005-02-05T00:00:00.000Z','2004-02-07T00:00:00.000Z','2003-02-01T00:00:00.000Z','2002-02-02T00:00:00.000Z','2001-02-03T00:00:00.000Z','2000-02-05T00:00:00.000Z'"
  ],
  [
    new Date(Date.UTC(2020, 1, 29)),
    "'2019-03-02T00:00:00.000Z','2018-03-03T00:00:00.000Z','2017-03-04T00:00:00.000Z','2016-03-05T00:00:00.000Z','2015-03-07T00:00:00.000Z','2014-03-01T00:00:00.000Z','2013-03-02T00:00:00.000Z','2012-03-03T00:00:00.000Z','2011-03-05T00:00:00.000Z','2010-03-06T00:00:00.000Z','2009-03-07T00:00:00.000Z','2008-03-01T00:00:00.000Z','2007-03-03T00:00:00.000Z','2006-03-04T00:00:00.000Z','2005-03-05T00:00:00.000Z','2004-03-06T00:00:00.000Z','2003-03-01T00:00:00.000Z','2002-03-02T00:00:00.000Z','2001-03-03T00:00:00.000Z','2000-03-04T00:00:00.000Z'"
  ]
])('get weeks', (date, exp) => {
  const weeks = Season.getWeeks(date);
  expect(weeks).toBe(exp);
});

test('get query', async () => {
  const query5 = Season.getQuery(5);
  const query10 = Season.getQuery(10);

  const rows5 = await query(query5);
  const rows10 = await query(query10);

  expect(rows5.length).toBeLessThan(rows10.length);
});

test('get songs', async () => {
  const rows5 = await Season.getSongs(5);
  const rows10 = await Season.getSongs(10);

  expect(rows5.length).toBeLessThan(rows10.length);
});
