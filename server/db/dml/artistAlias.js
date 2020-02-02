const { dml } = require('./dml.js');

const add = async (alias, chart, id) => {
  const result = await dml(`
    INSERT INTO ArtistAliases (alias, chart, ArtistId)
         VALUES ('${alias}', '${chart}', ${id});`);

  return result.insertId;
};

const remove = async id => {
  return dml(`
    DELETE FROM ArtistAliases
     WHERE id=${id};`);
};

const update = async (id, alias, chart) => {
  const result = await dml(`
    UPDATE ArtistAliases
       SET alias='${alias}',
           chart='${chart}'
     WHERE id=${id};`);

  return result.changedRows === 1;
};

module.exports = {
  add,
  remove,
  update
};
