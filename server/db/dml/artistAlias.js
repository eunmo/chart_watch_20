const {
  add: addAlias,
  remove: removeAlias,
  update: updateAlias,
} = require('./alias.js');

const add = async (alias, chart, id) => {
  return addAlias('Artist', alias, chart, id);
};

const remove = async (id) => {
  return removeAlias('Artist', id);
};

const update = async (id, alias, chart) => {
  return updateAlias('Artist', id, alias, chart);
};

module.exports = {
  add,
  remove,
  update,
};
