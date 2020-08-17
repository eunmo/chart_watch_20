const { dml } = require('@eunmo/mysql');

const add = async (order, feat, song, artist) => {
  return dml(`
    INSERT INTO SongArtists
         VALUES (${order}, ${feat}, ${song}, ${artist});`);
};

const remove = async (song, artist) => {
  return dml(`
    DELETE FROM SongArtists
          WHERE SongId=${song}
            AND ArtistId=${artist};`);
};

const update = async (order, feat, song, artist) => {
  const result = await dml(`
    UPDATE SongArtists
       SET \`order\`=${order},
           feat=${feat}
     WHERE SongId=${song}
       AND ArtistId=${artist};`);

  return result.changedRows === 1;
};

module.exports = {
  add,
  remove,
  update,
};
