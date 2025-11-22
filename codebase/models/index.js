// import all models
const Post = require("./post");
const Category = require("./category");
const User = require("./user");

Post.belongsTo(Category, {
  foreignKey: "categoryId",
});

Post.belongsTo(User, {
  foreignKey: "userId",
});

Category.hasMany(Post, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});



module.exports = {
  Post,
  Category,
  User,
};
