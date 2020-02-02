const { query } = require('./query.js');

const getNames = async ids => {
  const sql = `
    SELECT id, name, nameNorm
      FROM Artists
     WHERE id IN (${ids.join()});`;
  return query(sql);
};

const addNames = async artists => {
  const rows = await getNames(artists.map(a => a.id));
  const map = new Map(artists.map(a => [a.id, a]));

  rows.forEach(({ id, name, nameNorm }) => {
    map.get(id).name = name;
    map.get(id).nameNorm = nameNorm;
  });
};

const getDetail = async id => {
  const sql = `
    SELECT name, gender, \`type\`, origin
      FROM Artists
     WHERE id = ${id};`;
  return query(sql);
};

const getA = id => {
  const sql = `
    SELECT ar.\`type\`, ar.order, a.name, a.id
      FROM ArtistRelations ar, Artists a
     WHERE ar.b = ${id}
       AND ar.a = a.id;`;
  return query(sql);
};

const mapBs = async ids => {
  const sql = `
    SELECT ar.a, ar.b, ar.\`type\`, ar.order, a.name
      FROM ArtistRelations ar, Artists a
     WHERE ar.a in (${ids.join()})
       AND ar.b = a.id;`;
  const rows = await query(sql);
  const Bs = new Map();

  rows.forEach(({ a, b: id, type, order, name }) => {
    const b = { id, name };

    if (!Bs.has(a)) {
      Bs.set(a, new Map());
    }

    const artist = Bs.get(a);

    if (type !== 'p') {
      artist.set(type, b);
    } else {
      // project group needs an order.
      if (!artist.has(type)) {
        artist.set(type, []);
      }
      artist.get(type)[order] = b;
    }
  });

  return Bs;
};

const getAlbumsAndSongs = ids => {
  const sql = `
    SELECT ArtistId, b.AlbumId, SongId, disk, track
      FROM AlbumArtists a, AlbumSongs b
     WHERE a.ArtistId in (${ids.join()})
       AND a.AlbumId = b.AlbumId
    UNION
    SELECT ArtistId, AlbumId, a.SongId, disk, track
      FROM SongArtists a, AlbumSongs b
     WHERE a.ArtistId in (${ids.join()})
       AND a.SongId = b.SongId;`;
  return query(sql);
};

module.exports = {
  getNames,
  addNames,

  getDetail,

  getA,
  mapBs,

  getAlbumsAndSongs
};
