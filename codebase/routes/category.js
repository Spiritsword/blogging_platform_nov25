// create a new router
const app = require("express").Router();

//import authentication
const { signToken, authMiddleware} = require("../utils/auth");

// import the models
const { Post, Category, User } = require("../models/index");

// Route to add a new category
app.post("/", async (req, res) => {
  try {
    const category_name = req.body.name;
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error: error });
  }
});

// Route to get all categories
app.get("/", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error obtaining all categories", error: error });
  }
});

//Route to get single category
app.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving category" });
  }
});

// Route to update a category
app.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const post = await Category.update(
      { name },
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
});

// Route to delete a category
app.delete("/:id", async (req, res) => {
  try {
    const category = await Category.destroy({ where: { id: req.params.id } });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
});

// export the router
module.exports = app;
