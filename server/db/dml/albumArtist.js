const { dml } = require('../query.js');

const add = async (order, album, artist) => {
  return dml(`
    INSERT INTO AlbumArtists
         VALUES (${order}, ${artist}, ${album});`);
};

const remove = async (album, artist) => {
  return dml(`
    DELETE FROM AlbumArtists
          WHERE AlbumId=${album}
            AND ArtistId=${artist};`);
};

const update = async (order, album, artist) => {
  const result = await dml(`
    UPDATE AlbumArtists
       SET \`order\`=${order}
     WHERE AlbumId=${album}
       AND ArtistId=${artist};`);

  return result.changedRows === 1;
};

module.exports = {
  add,
  remove,
  update
};
