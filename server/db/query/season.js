const { query } = require('./query.js');

const getWeeks = date => {
  const mm = date.getMonth();
  const dd = date.getDate();
  const dates = [];

  for (let yy = date.getFullYear() - 1; yy >= 2000; yy -= 1) {
    const d = new Date(Date.UTC(yy, mm, dd));
    d.setDate(d.getDate() + (6 - d.getDay()));
    dates.push(`'${d.toISOString()}'`);
  }

  return dates.join(',');
};

const getQuery = limit => {
  return `
    SELECT SongId as id
      FROM SingleCharts
     WHERE \`rank\` <= ${limit}
       AND week IN (${getWeeks(new Date())})
       AND SongId is not null
  ORDER BY week DESC, \`rank\`;`;
};

const getSongs = limit => {
  return query(getQuery(limit));
};

module.exports = {
  getWeeks,

  getQuery,

  getSongs
};
