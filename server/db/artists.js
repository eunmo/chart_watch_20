const { query } = require('./query.js');

const getNames = async ids => {
  const sql = `
    SELECT id, name, nameNorm
      FROM Artists
     WHERE id IN (${ids.join()});`;
  return query(sql);
};

const getDetail = async id => {
  const sql = `
    SELECT name, gender, \`type\`, origin
      FROM Artists
     WHERE id = ${id};`;
  return query(sql);
};

module.exports = {
  getNames,
  getDetail
};
