const { dml } = require('../query.js');

const add = async (type, alias, chart, id) => {
  const result = await dml(`
    INSERT INTO ${type}Aliases (alias, chart, ${type}Id)
         VALUES ('${alias}', '${chart}', ${id});`);

  return result.insertId;
};

const remove = async (type, id) => {
  return dml(`
    DELETE FROM ${type}Aliases
     WHERE id=${id};`);
};

const update = async (type, id, alias, chart) => {
  const result = await dml(`
    UPDATE ${type}Aliases
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
