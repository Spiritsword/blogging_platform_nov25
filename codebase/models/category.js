const { Model, DataTypes} = require("sequelize");

const sequelize = require("../config/connection");

class Category extends Model {}

Category.init(
  { id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "category",
  }
);

// Export Post model
module.exports = Category;
