const userStorage = require("../storage/userStorage.cjs");
const { body, validationResult } = require("express-validator");

const lengthErrors = {
  email: "email length must be at least 12 character long",
  username: "username must have length in range from 3 to 15 character long",
};
const valueErrors = {
  username:
    "username must not contain special character, (excluding underscode '_')",
};

const userValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage(lengthErrors.username)
    .matches(/^[a-zA-Z_ ]+$/)
    .withMessage(valueErrors.username),
  body("email").trim().isLength({ min: 12 }).withMessage(lengthErrors.email),
];

exports.ListUserGet = async (req, res) => {
  const userData = await userStorage.getUsers();
  res.render("userList", {
    title: "List User",
    users: await userStorage.getUsers(),
  });
};

exports.createUserGet = (req, res) => {
  res.render("userCreate", {
    title: "Create User",
  });
};

exports.createUserPost = [
  userValidation,
  async (req, res) => {
    const errors = validationResult(req);
    const { username, email, age, bio } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("userCreate", {
        title: "Create User",
        username,
        email,
        age,
        bio,
        errors: errors.array(),
      });
    }

    await userStorage.addUser({ username, email, age, bio });
    res.redirect("/");
  },
];

exports.updateUserGet = async (req, res) => {
  const userId = req.params.userId;
  const data = await userStorage.getUser(userId);
  res.render("userUpdate", {
    title: "Update User",
    userId: userId,
    username: data.username,
    email: data.email,
    age: data.age,
    bio: data.bio,
  });
};

exports.updateUserPost = [
  userValidation,
  async (req, res) => {
    const userId = req.params.userId;
    const { username, email, age, bio } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("userUpdate", {
        title: "Update User",
        userId,
        username,
        email,
        age,
        bio,
        errors: errors.array(),
      });
    }
    await userStorage.updateUser(userId, { username, email, age, bio });
    res.redirect("/");
  },
];

exports.deleteUserPost = async (req, res) => {
  const userId = req.params.userId;
  await userStorage.deleteUser(userId);
  res.redirect("/");
};

exports.searchUserGet = async (req, res) => {
  const userQuery = req.query.q || "";
  const searchResult = await userStorage.searchUser(userQuery);
  res.render("userSearch", { title: "User Search", users: searchResult });
};
