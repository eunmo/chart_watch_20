const { dml } = require('./dml.js');

const add = async (title, time, bitrate) => {
  const result = await dml(`
    INSERT INTO Songs (title, time, bitrate)
         VALUES ('${title}', ${time}, ${bitrate});`);

  return result.insertId;
};

const update = async (id, title, plays) => {
  const result = await dml(`
    UPDATE Songs
       SET
     title='${title}',
     plays=${plays}
     WHERE id=${id};`);

  return result.changedRows === 1;
};

module.exports = {
  add,
  update
};