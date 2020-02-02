const { dml } = require('../query.js');

const add = async (type, order, a, b) => {
  return dml(`
    INSERT INTO ArtistRelations (type, \`order\`, A, B)
         VALUES ('${type}', ${order}, ${a}, ${b});`);
};

const remove = async (a, b) => {
  return dml(`
    DELETE FROM ArtistRelations
     WHERE A=${a}
       AND B=${b};`);
};

const update = async (type, order, a, b) => {
  const result = await dml(`
    UPDATE ArtistRelations
       SET type='${type}',
           \`order\`=${order}
     WHERE A=${a}
       AND B=${b};`);

  return result.changedRows === 1;
};

module.exports = {
  add,
  remove,
  update
};
