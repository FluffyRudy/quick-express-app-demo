const { Router } = require("express");
const userController = require("../controllers/userController.cjs");

const userRouter = Router();

userRouter.get("/", userController.ListUserGet);
userRouter.get("/create", userController.createUserGet);
userRouter.post("/create", userController.createUserPost);
userRouter.get("/:userId/update", userController.updateUserGet);
userRouter.post("/:userId/update", userController.updateUserPost);
userRouter.post("/:userId/delete", userController.deleteUserPost);
userRouter.get("/search", userController.searchUserGet);

module.exports = { userRouter };
