// create a new router
const app = require("express").Router();

//import authentication
const { signToken, authMiddleware } = require("../utils/auth");

// import the models
const { Post, Category, User }  = require("../models/index");

// Route to add a new post
app.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const {title, content, categoryId} = req.body;
    const post = await Post.create({title, content, userId, categoryId, createdOn: new Date()});
    res.status(201).json(post);
  } catch (error) {
  console.error("CREATE POST ERROR:", error);
  res.status(500).json({ error: error.message });
  }
}
);

// Route to get all posts
app.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving posts", error });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving post" });
  }
});

// Route to update a post
app.put("/:id", async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const postedBy = req.user.username;
    const post = await Post.update(
      { title, content, categoryId, postedBy, createdOn: new Date()},
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// Route to delete a post
app.delete("/:id", async (req, res) => {
  try {
    const post = await Post.destroy({ where: { id: req.params.id } });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

// export the router
module.exports = app;
