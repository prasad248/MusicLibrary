module.exports = (sequelize,DataTypes) => {
    const Composers =sequelize.define("composers", {
      Name : {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
 return Composers;
  }; 