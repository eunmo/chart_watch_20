const { dml } = require('../query.js');

const add = async (title, time, bitrate) => {
  const result = await dml(`
    INSERT INTO Songs (title, time, bitrate)
         VALUES ('${title}', ${time}, ${bitrate});`);

  return result.insertId;
};

const update = async (id, title, plays) => {
  const result = await dml(`
    UPDATE Songs
       SET title='${title}',
           plays=${plays}
     WHERE id=${id};`);

  return result.changedRows === 1;
};

function toTimestamp(date) {
  const time = new Date(date);
  return time
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
}

const recordPlay = async (id, plays, lastPlayed) => {
  const result = await dml(`
    UPDATE Songs
       SET plays=${plays},
           lastPlayed='${toTimestamp(lastPlayed)}'
     WHERE id=${id};`);

  return result.changedRows === 1;
};

module.exports = {
  add,
  update,
  recordPlay
};
