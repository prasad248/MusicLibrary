const db = require("../models");
const { sequelize } = require('../models') 
const AlbumModel = db.albums;
const SongModel = db.songs;
const ComposerModel = db.composers;
const LyricistModel = db.lyricists;
const SingerModel = db.singers;


const createAlbum =  async (req, res) => {
    const t = await sequelize.transaction(); 
    try{
     const title =req.body.title;
     const Year = req.body.Year;
     const album = await AlbumModel.create({title: title,Year: Year},{transaction:t});
     //creating Songs 
      let song = req.body.song;
      for(let i in song){
        const songs = await album.createSong({Name: song[i].Name,length: song[i].length},{transaction:t})
        //creating singer
        let singer = song[i].Singer;
        for(let j in singer){
          const check_singer = await SingerModel.findOne({where:{Name: singer[j].Name}},{transaction:t})
          // check if already exists
          if(check_singer === null){
          const Singers = await SingerModel.create({
            Name: singer[j].Name 
          },{transaction:t})
          await songs.addSinger(Singers,{transaction:t});
        }else{
          await songs.addSinger(check_singer,{transaction:t});
        }
        }
       //creating composers
       let composer = song[i].Composer;
       for(let k in composer){
        const check_composer = await ComposerModel.findOne({where:{Name: composer[k].Name}},{transaction:t})
        // check if already exists
         if(check_composer === null){
         const composers = await ComposerModel.create({
           Name: composer[k].Name
         },{transaction:t})
         await songs.addComposer(composers,{transaction:t});
        }else{
         await songs.addComposer(check_composer,{transaction:t});
        }
       }
       //creating lyricists
       let lyricist = song[i].Lyricist;
       for(let l in lyricist){
         const check_lyricist = await LyricistModel.findOne({where:{Name: lyricist[l].Name}},{transaction:t})
         // check if already exists
         if(check_lyricist === null){
         const Lyricists = await LyricistModel.create({
           Name: lyricist[l].Name
         },{transaction:t})
         await songs.addLyricist(Lyricists,{transaction:t});
       }else{
         await songs.addLyricist(check_lyricist,{transaction:t})
       }
      }
  }
  await t.commit();
  res.json(album)
  }catch(err){
    console.log(err);
    await t.rollback();
  }
  }
//fetch the data from DB along with Songs info and all members

const fetchAllData = async (req, res) => {
  try{

    const album = AlbumModel.findAll({
        include:{
            model: SongModel,
            include:[{
                model: SingerModel,
                through:{

                }
            },
            {
                model: ComposerModel,
                through:{

                }
            },
            {
                model: LyricistModel,
                through:{
    
                }
            }  
        ]}

    }) 
    
    res.send(album)
    
  }catch(err){
    console.log(err);
  }
 
};

// fetch all the song/track(s) from DB irrespective of the albums, but along with the album info

 const fetchAllSongs = async (req, res) => {
  try{
      const song = await SongModel.findAll({
          include:{
              model:AlbumModel
          }
      })
    
      res.send(song)
  
}
catch(err){
    console.log(err);
  }
 
};

//fetch single song details using the id given in params

const findSongbyId = async (req,res) => {
  try{

    const albumId = req.params.albumId;
    const songId = req.params.songId;

    const song = await SongModel.findOne({
        where:{
            albumId:albumId,
            id:songId
        },
        include:[{
           model : ComposerModel,
           through: {

          }
        },
          {
            model: SingerModel,
            through: {

            }
          },
          {
            model: LyricistModel,
            through: {
              
            }
          
        }] 
     })
    if(song===null){
     return res.status(404).json({error: "song is not present"})
    }
    res.status(200).json(song)
  
}catch(err){
    console.log(err);
  }
}

//updating music album info

const updateAlbum = async (req, res) => {
  try{
    const albumId = req.params.albumId;
    const check_album = await AlbumModel.findByPk(albumId)
      if (!check_album) {
       return  res.status(404).json({ error: "album is not present" });
      } 
    const title = req.body.title;
    const Year = req.body.Year;

    const album = await check_album.update({title:title,Year:Year})

   res.send(album)
  }catch(err){
    console.log(err);
  }
 
};

//updating song info under an album

const updateSong = async (req,res) => {
  try{
    const albumId = req.params.albumId;

    const check_album = await AlbumModel.findByPk(albumId)
      if (!check_album) {
       return  res.status(404).json({ error: "album is not present" });
      } 

      const songId = req.params.songId;

      const check_song = await SongModel.findByPk(songId)
      if (!check_song) {
        return  res.status(404).json({ error: "song is not present" });
       } 

      const Name = req.body.Name;
      const length = req.body.length;

      const song = await check_song.update({Name:Name,length:length})
      res.send(song)

  }catch(err){
    console.log(err);
  }
 
}

//creating a new song under an album 

const createSong = async (req,res) => {
  try{
    const albumId = req.params.albumId;

    const check_album = await AlbumModel.findByPk(albumId)
    if (!check_album) {
     return  res.status(404).json({ error: "album is not present" });
    } 
    let song = req.body.song;
      const songs = await check_album.createSong({
        Name: song.Name,
        length: song.length
      })

      let singer = song.Singer;
      for(let i in singer){
        const check_singer = await SingerModel.findOne({where:{Name: singer[i].Name}})

        if(check_singer === null){
        const Singers = await SingerModel.create({
          Name: singer[i].Name
        })
        await songs.addSinger(Singers);
      }else{
        await songs.addSinger(check_singer);
      }
      }

     let composer = song.Composer;
     for(let i in composer){
      const check_composer = await ComposerModel.findOne({where:{Name: composer[i].Name }})

       if(check_composer === null){
       const composers = await ComposerModel.create({
         Name: composer[i].Name
       })
       await songs.addComposer(composers);
      }else{
       await songs.addComposer(check_composer);
      }
     }

     let lyricist = song.Lyricist;
     for(let i in lyricist){
       const check_lyricist = await LyricistModel.findOne({where:{Name: lyricist[i].Name}})

       if(check_lyricist === null){
       const Lyricists = await LyricistModel.create({
         Name: lyricist[i].Name
       })
       await songs.addLyricist(Lyricists);
     }else{
       await songs.addLyricist(check_lyricist)
     }
    }
    res.send("Sucessfull!");
  }catch(err){
    console.log(err);
  }
 
}

//delete the entire music album along with songs 

const deleteAlbum = async (req, res) => {
  try{
    const albumId = req.params.albumId;
    const check_album = await AlbumModel.findByPk(albumId)
    if(!check_album){
      return  res.status(404).json({ error: "The album could not be found." });
    }
    await check_album.destroy();
    res.send("Deleted Album sucessfully!")
  }catch(err){
    console.log(err);
  }
 
  
};

//delete a song from an existing music album

const deleteSong = async (req, res) => {
  try{
    const albumId = req.params.albumId;
    const check_album = await AlbumModel.findByPk(albumId)
    if(!check_album){
      return  res.status(404).json({ error: "The album could not be found." });
    }
    const songId = req.params.songId;
      const check_song = await SongModel.findByPk(songId)
      if (!check_song) {
        return  res.status(404).json({ error: "The song could not be found." });
       } 
     await check_song.destroy();
    res.send("Deleted song  sucessfully!")
    
  }catch(err){
    console.log(err);
  }
}
module.exports = {
    createAlbum,
    fetchAllData,
    fetchAllSongs,
    findSongbyId,
    updateAlbum,
    updateSong,
    createSong,
    deleteAlbum,
    deleteSong
}