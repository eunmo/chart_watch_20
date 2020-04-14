const {
  add: addAlias,
  remove: removeAlias,
  update: updateAlias,
} = require('./alias.js');

const add = async (alias, chart, id) => {
  return addAlias('Song', alias, chart, id);
};

const remove = async (id) => {
  return removeAlias('Song', id);
};

const update = async (id, alias, chart) => {
  return updateAlias('Song', id, alias, chart);
};

module.exports = {
  add,
  remove,
  update,
};
