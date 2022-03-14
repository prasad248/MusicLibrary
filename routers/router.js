module.exports = app => {
    const albums = require('../controllers/controllers');

    const router = require("express").Router();

    router.post("/albums",albums.createAlbum);

    // fetch the data from DB along with Songs info and all members
    router.get("/albums",albums.fetchAllData );

    // fetch all the song/track(s) from DB irrespective of the albums, but along with the album info
    router.get("/songs", albums.fetchAllSongs);

    // fetch single song details using the id given in params
    router.get("/albums/:albumId/songs/:songId",albums.findSongbyId );

    // updating music album info
    router.put("/albums/:albumId", albums.updateAlbum );

    //updating song info under an album
    router.put("/albums/:albumId/songs/:songId", albums.updateSong );

    //creating a new song under an album 
    router.post("/albums/:albumId/songs",albums.createSong );

    //delete the entire music album along with songs 
    router.delete("/albums/:albumId", albums.deleteAlbum);

    //delete a song from an existing music album 
    router.delete("/albums/:albumId/songs/:songId", albums.deleteSong );

    app.use('/', router);
  };