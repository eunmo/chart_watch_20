const { query } = require('./query.js');

const getDetails = async ids => {
  const sql = `
    SELECT id, title, format, format2, \`release\`
      FROM Albums
     WHERE id IN (${ids.join()});`;
  return query(sql);
};

module.exports = {
  getDetails
};
