// create a new router
const app = require("express").Router();

// import the models
const { Category } = require("../models/index");

// Route to add a new category
app.post("/", async (req, res) => {
  try {
    console.log("req.body:", req.body)
    const category_name = req.body.name;
    console.log("category name:", category_name)
    const category = await Category.create({ category_name });
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding category", error: error });
  }
});

// Route to get all categories
app.get("/", async (req, res) => {
  try {
    console.log("Getting all categories");
    const categories = await Category.findAll();
    console.log(categories);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error obtaining all categories", error: error });
  }
});

//Route to get single category
app.get("/:id", async (req, res) => {
  try {
    const category = await Post.findByPk(req.params.id);
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
