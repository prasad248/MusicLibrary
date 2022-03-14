module.exports = (sequelize,DataTypes) => {
    const lyricists =sequelize.define("lyricists", {
      Name : {
        type: DataTypes.STRING,
        allowNull: false
      },
      
    });
 return lyricists;
  };