module.exports = (sequelize,DataTypes) => {
    const songs =sequelize.define("songs", {
      Name: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      length: {
        type:DataTypes.INTEGER
      },
    });
 return songs;
  };