const { query } = require('./query.js');
const {
  Album,
  AlbumArtist,
  AlbumSong,
  Artist,
  Song,
  SongArtist,
} = require('./dml');

async function getArtists(tag, key) {
  const normKey = `${key}Norm`;
  const artistIds = [];
  for (let i = 0; i < tag[key].length; i += 1) {
    const id = await Artist.findOrCreate(tag[key][i], tag[normKey][i]); // eslint-disable-line no-await-in-loop
    artistIds.push(id);
  }

  return artistIds;
}

const upload = async (tag) => {
  const artists = await getArtists(tag, 'artist');
  const albumArtists = await getArtists(tag, 'albumArtist');
  const feats = await getArtists(tag, 'feat');
  let newAlbum = false;

  const albumRows = await query(`
    SELECT id FROM AlbumArtists a, Albums b
     WHERE a.ArtistId in (${albumArtists.join(',')})
       AND a.AlbumId=b.id AND title='${tag.album}';`);

  let albumId = null;
  if (albumRows.length === 0) {
    albumId = await Album.add(
      tag.album,
      new Date(Date.UTC(tag.year, tag.month, tag.day)),
      null
    );

    await Promise.all(
      albumArtists.map((id, index) => AlbumArtist.add(index, albumId, id))
    );

    newAlbum = true;
  } else {
    albumId = albumRows[0].id;
  }

  const songId = await Song.add(tag.title, tag.time, tag.bitrate);
  await Promise.all(
    artists.map((id, index) => SongArtist.add(index, false, songId, id))
  );
  await Promise.all(
    feats.map((id, index) => SongArtist.add(index, true, songId, id))
  );

  const disk = tag.disk === 0 ? 1 : tag.disk;
  await AlbumSong.add(disk, tag.track, songId, albumId);

  return [songId, newAlbum];
};

module.exports = { upload };
