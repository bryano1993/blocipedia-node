"use strict";
module.exports = (sequelize, DataTypes) => {
  var Collaborator = sequelize.define(
    "Collaborator",
    {
      wikiId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Collaborator.associate = function(models) {
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Collaborator.addScope("collaboratorsFor", wikiId => {
      return {
        include: [
          {
            model: models.User
          }
        ],
        where: { wikiId: wikiId },
        order: [["createdAt", "ASC"]]
      };
    });
    Collaborator.addScope("collaborationsFor", userId => {
      return {
        include: [
          {
            model: models.Wiki
          }
        ],
        where: { userId: userId },
        order: [["createdAt", "ASC"]]
      };
    });
  };
  return Collaborator;
};
