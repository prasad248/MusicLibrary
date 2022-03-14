const {Sequelize,DataTypes} = require("sequelize");
const sequelize = new Sequelize('musicLibrary', 'root', 'PRP@248', {
  host: 'localhost',
  dialect: 'mysql' ,
  pool:{max: 5,min: 0,acquire: 30000,idle: 10000}
});

sequelize.authenticate()
.then(()=>{
   console.log("connected.....")
})
.catch(
    err=>{
        console.log("error"+err)
    }
)

const db={};

db.Sequelize=Sequelize;
db.sequelize=sequelize;

//importing models

db.composers = require("./composersModel")(sequelize, DataTypes);
db.songs = require("./songsModel")(sequelize, DataTypes);
db.albums = require("./albumsModel")(sequelize, DataTypes);
db.lyricists = require("./lyricistsModel")(sequelize, DataTypes);
db.singers = require("./singersModel")(sequelize, DataTypes);


db.albums.hasMany(db.songs,{onDelete: 'CASCADE', onUpdate: 'RESTRICT'})
db.songs.belongsTo(db.albums,{onDelete: 'RESTRICT',onUpdate: 'RESTRICT'});

db.songs.belongsToMany(db.composers, {through: 'SongComposer'});
db.composers.belongsToMany(db.songs, {through: 'SongComposer'});

db.songs.belongsToMany(db.singers, {through: 'SongSinger'});
db.singers.belongsToMany(db.songs, {through: 'SongSinger'});

db.songs.belongsToMany(db.lyricists, {through: 'SongLyricist'});  
db.lyricists.belongsToMany(db.songs, {through: 'SongLyricist'});


module.exports = db