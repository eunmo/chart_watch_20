const { dml } = require('../query.js');

const add = async (disk, track, songId, albumId) => {
  return dml(`
    INSERT INTO AlbumSongs (disk, track, SongId, AlbumId)
         VALUES (${disk}, ${track}, ${songId}, ${albumId});`);
};

module.exports = {
  add,
};
