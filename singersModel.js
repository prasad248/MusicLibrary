module.exports = (sequelize,DataTypes) => {
    const singers =sequelize.define("singers", {
      Name : {
        type: DataTypes.STRING,
        allowNull: false
      },
    });
 return singers;
  };