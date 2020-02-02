const { dml } = require('./dml.js');

function toDateString(date) {
  return date.toISOString().substring(0, 10);
}

const add = async (title, release, format) => {
  const formatS = format === null ? 'NULL' : `'${format}'`;

  const result = await dml(`
    INSERT INTO Albums (title, \`release\`, format)
         VALUES ('${title}', '${toDateString(release)}', ${formatS});`);

  return result.insertId;
};

const update = async (id, title, release, format, format2) => {
  const result = await dml(`
     UPDATE Albums
        SET title='${title}',
            \`release\`='${toDateString(release)}',
            format=${format === null ? 'NULL' : `'${format}'`},
            format2=${format2 === null ? 'NULL' : `'${format2}'`}
     WHERE id=${id};`);

  return result.changedRows === 1;
};

module.exports = {
  add,
  update
};
