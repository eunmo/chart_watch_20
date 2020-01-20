const { query } = require('../query.js');

const getDetails = async ids => {
  const sql = `
    SELECT id, title, plays
      FROM Songs
     WHERE id IN (${ids.join()});`;
  return query(sql);
};

const getArtists = async ids => {
  const sql = `
    SELECT SongId, ArtistId, name, feat, \`order\`
      FROM SongArtists a, Artists b
     WHERE a.SongId IN (${ids.join()})
       AND a.ArtistId = b.id;`;
  return query(sql);
};

const getAlbums = async ids => {
  const sql = `
    SELECT SongId, AlbumId, \`release\`
      FROM AlbumSongs a, Albums b
     WHERE a.SongId IN (${ids.join()})
       AND a.AlbumId = b.id
  ORDER BY \`release\`;`;
  return query(sql);
};

const mapAlbumIds = async ids => {
  const sql = `
    SELECT SongId, AlbumId, disk, track
      FROM AlbumSongs
     WHERE SongId IN (${ids.join()})
  ORDER BY SongId, AlbumId;`;
  const rows = await query(sql);
  const albums = new Map();

  rows.forEach(({ SongId: id, AlbumId, disk, track }) => {
    const album = { id: AlbumId, disk, track };

    if (!albums.has(id)) {
      albums.set(id, []);
    }

    albums.get(id).push(album);
  });

  return albums;
};

const mapArtists = async ids => {
  const rows = await getArtists(ids);
  const artists = new Map();

  rows.forEach(({ SongId: id, ArtistId, name, feat, order }) => {
    const artist = { id: ArtistId, name };

    if (!artists.has(id)) {
      artists.set(id, { artists: [], features: [] });
    }

    artists.get(id)[feat ? 'features' : 'artists'][order] = artist;
  });

  return artists;
};

const addDetails = async songs => {
  const rows = await getDetails(songs.map(s => s.id));
  const map = new Map(songs.map(s => [s.id, s]));

  rows.forEach(({ id, title, plays }) => {
    map.get(id).title = title;
    map.get(id).plays = plays;
  });
};

const addArtists = async songs => {
  const artists = await mapArtists(songs.map(s => s.id));
  const map = new Map(songs.map(s => [s.id, s]));

  artists.forEach((entry, id) => {
    map.get(id).artists = entry.artists;
    map.get(id).features = entry.features;
  });
};

const addAlbum = async songs => {
  const rows = await getAlbums(songs.map(s => s.id));
  const map = new Map(songs.map(s => [s.id, s]));

  rows.forEach(({ SongId, AlbumId }) => {
    const song = map.get(SongId);
    if (song.albumId === undefined) {
      song.albumId = AlbumId;
    }
  });
};

const addMinRank = async songs => {
  const sql = `
    SELECT SongId id, min(\`rank\`) \`rank\`
      FROM SingleCharts
     WHERE SongId IN (${songs.map(s => s.id).join()})
       AND \`rank\` <= 10
  GROUP BY SongId;`;
  const rows = await query(sql);
  const map = new Map(songs.map(s => [s.id, s]));

  rows.forEach(({ id, rank }) => {
    map.get(id).minRank = rank;
  });
};

const addFavorite = async songs => {
  const sql = `
    SELECT DISTINCT id
      FROM (SELECT SongId id
              FROM Artists a, AlbumArtists aa, AlbumSongs s
             WHERE a.favorites = true
               AND a.id = aa.ArtistId
               AND aa.AlbumId = s.AlbumId
             UNION
            SELECT SongId id
              FROM SongArtists sa, Artists a
             WHERE a.favorites = true
               AND a.id = sa.ArtistId
             UNION
            SELECT SongId id
              FROM Artists a, ArtistRelations b, AlbumArtists aa, AlbumSongs s
             WHERE a.favorites = true
               AND a.id = b.b
               AND b.a = aa.ArtistId
               AND aa.AlbumId = s.AlbumId
             UNION
            SELECT SongId id
              FROM SongArtists sa, Artists a, ArtistRelations b
             WHERE a.favorites = true
               AND a.id = b.b
               AND b.a = sa.ArtistId) a
    WHERE a.id IN (${songs.map(s => s.id).join()});`;
  const rows = await query(sql);
  const map = new Map(songs.map(s => [s.id, s]));

  rows.forEach(({ id }) => {
    map.get(id).favorite = true;
  });
};

module.exports = {
  addAlbum,
  addArtists,
  addDetails,
  addFavorite,
  addMinRank,
  getAlbums,
  getArtists,
  getDetails,
  mapAlbumIds,
  mapArtists
};
