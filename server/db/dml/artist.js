const { dml, query } = require('../query.js');

const findOrCreate = async (name, nameNorm) => {
  const ArtistIds = await query(`
    SELECT ArtistId
      FROM ArtistAliases
     WHERE alias='${name}'
       AND chart='upload';`);

  if (ArtistIds.length > 0) {
    return ArtistIds[0].ArtistId;
  }

  const ids = await query(`
    SELECT id
      FROM Artists
     WHERE name='${name}'
        OR nameNorm='${nameNorm}'`);

  if (ids.length > 0) {
    return ids[0].id;
  }

  const result = await dml(`
    INSERT INTO Artists (name, nameNorm)
         VALUES ('${name}', '${nameNorm}');`);

  return result.insertId;
};

const update = async (id, origin, type, gender, favorites) => {
  const result = await dml(`
    UPDATE Artists
       SET origin=${origin === null ? null : `'${origin}'`},
           type=${type === null ? null : `'${type}'`},
           gender=${gender === null ? null : `'${gender}'`},
           favorites=${favorites === true ? 1 : null}
     WHERE id=${id};`);

  return result.changedRows === 1;
};

const merge = async (toId, fromId) => {
  await dml(`
    UPDATE ArtistAliases
       SET ArtistId=${toId}
     WHERE ArtistId=${fromId};`);
  await dml(`
    UPDATE ArtistRelations
       SET a=${toId}
     WHERE a=${fromId};`);
  await dml(`
    UPDATE ArtistRelations
       SET b=${toId}
     WHERE b=${fromId};`);
  await dml(`
    UPDATE SongArtists
       SET ArtistId=${toId}
     WHERE ArtistId=${fromId};`);
  await dml(`
    UPDATE AlbumArtists
       SET ArtistId=${toId}
     WHERE ArtistId=${fromId};`);
  await dml(`
    DELETE FROM Artists
          WHERE id=${fromId};`);
};

module.exports = {
  findOrCreate,
  merge,
  update,
};
