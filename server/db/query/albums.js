const { query } = require('./query.js');
const { mapBs } = require('./artists.js');

const getDetails = async ids => {
  const sql = `
    SELECT id, title, format, format2, \`release\`
      FROM Albums
     WHERE id IN (${ids.join()});`;
  return query(sql);
};

const addDetails = async albums => {
  const rows = await getDetails(albums.map(a => a.id));
  const map = new Map(albums.map(a => [a.id, a]));

  rows.forEach(({ id, title, format, format2, release }) => {
    map.get(id).title = title;
    map.get(id).format = format;
    map.get(id).format2 = format2;
    map.get(id).release = release;
  });
};

const mapArtists = async ids => {
  const sql = `
    SELECT AlbumId, \`order\`, ArtistId, name
      FROM AlbumArtists a, Artists b
     WHERE a.AlbumId in (${ids.join()})
       AND a.ArtistId = b.id;`;
  const rows = await query(sql);

  const albumArtists = new Map();
  const artists = new Set();

  rows.forEach(({ AlbumId, order, ArtistId, name }) => {
    if (!albumArtists.has(AlbumId)) {
      albumArtists.set(AlbumId, []);
    }

    albumArtists.get(AlbumId)[order] = { id: ArtistId, name };
    artists.add(ArtistId);
  });

  const bs = await mapBs([...artists]);
  return new Map(
    [...albumArtists].map(([key, value]) => [
      key,
      value.map(({ id, name }) => {
        if (bs.has(id)) {
          return { id, name, Bs: bs.get(id) };
        }
        return { id, name };
      })
    ])
  );
};

const addArtists = async albums => {
  const artists = await mapArtists(albums.map(a => a.id));
  const map = new Map(albums.map(a => [a.id, a]));

  artists.forEach((entry, id) => {
    map.get(id).artists = entry;
  });
};

const mapSongs = async ids => {
  const sql = `
    SELECT SongId, AlbumId, disk, track
      FROM AlbumSongs a
     WHERE a.AlbumId in (${ids.join()})
  ORDER BY AlbumId, disk, track;`;
  const rows = await query(sql);

  const albumSongs = new Map();
  rows.forEach(({ SongId, AlbumId, disk, track }) => {
    if (!albumSongs.has(AlbumId)) {
      albumSongs.set(AlbumId, []);
    }

    albumSongs.get(AlbumId).push({ id: SongId, disk, track });
  });

  return albumSongs;
};

module.exports = {
  addDetails,
  getDetails,

  mapArtists,
  addArtists,

  mapSongs
};
