const mongodb = require("../mongodb/mongodb_init.js");
const createError = require("http-errors");
const User = require("../mongodb/schemas/user_schema.js");
const Router = require("express");

var router = Router();

router.get("/users", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments();

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      page: Number(page),
      totalPages,
      totalUsers,
      users,
    });
  } catch (error) {
    res.status(500).send("Error retrieving users: " + error.message);
  }
});

router.post("/users", async (req, res) => {
  const { name, age } = req.body;
  console.log(req.body);

  try {
    const newUser = new User({ name, age });
    await newUser.save();
    res.status(201).send("User added");
  } catch (error) {
    res.status(500).send("Error adding user: " + error.message);
  }
});

router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { age } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { age },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User deleted");
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

module.exports = router;
