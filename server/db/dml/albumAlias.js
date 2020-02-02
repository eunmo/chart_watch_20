const {
  add: addAlias,
  remove: removeAlias,
  update: updateAlias
} = require('./alias.js');

const add = async (alias, chart, id) => {
  return addAlias('Album', alias, chart, id);
};

const remove = async id => {
  return removeAlias('Album', id);
};

const update = async (id, alias, chart) => {
  return updateAlias('Album', id, alias, chart);
};

module.exports = {
  add,
  remove,
  update
};
