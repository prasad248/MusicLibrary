module.exports = (sequelize, DataTypes) => {
    const album = sequelize.define("album", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      Year: {
        type: DataTypes.INTEGER,
        allowNull: false
       
      },
    });
return album;
  };