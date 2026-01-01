const router = require("express").Router();
const { Post, Category, User }  = require("../models/index");
const { signToken, authMiddleware } = require("../utils/auth");

// Get current authenticated user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log("Getting current user", req.user.id);
    const me = await User.findByPk(req.user.id);
    console.log("Found user", me);
    if (!me) return res.status(401).json({ message: "Token expired" });
    return res.status(200).json({ me });
  } catch (err) {
  console.error("ERROR in /me:", err);
  res.status(500).json({ message: err.message });
}
});

// GET the User record
router.get("/:id", async (req, res) => {
  console.log("looking for user", req.params.id);
  try {
    const userData = await User.getOne(req.params.id);
    if (!userData) {
      res.status(404).json({ message: "No User found with this id" });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("Getting all users");
    const users = await User.findAll();
    console.log("Found users");
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);
    const token = signToken(userData);
    res.status(200).json({ token, userData });
  } catch (err) {
    res.status(400).json(err);
  }
});

// UDPATE the User record
router.put("/:id", async (req, res) => {
  try {
    const userData = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!userData) {
      res.status(404).json({ message: "No User found with this id" });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const token = signToken(userData);
    res.status(200).json({ token, userData });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  res.status(204).end();
});

module.exports = router;
