const userController = require("../controllers/userController");
const express = require("express");
const userRouter = express.Router();

userRouter.post("/signupUser", userController.signupUser);
userRouter.post("/loginUser", userController.loginUser);
userRouter.post("/signupJurnalis", userController.signupJurnalis);
userRouter.post("/loginJurnalis", userController.loginJurnalis);
userRouter.get("/getAllUser", userController.getAllUser);
userRouter.get("/getAllJurnalis", userController.getAllJurnalis);
userRouter.get("/getUser/:username", userController.getUserByUsername);
userRouter.get("/getJurnalis/:username", userController.getJurnalisByUsername);
userRouter.get("/getJurnalisById/:id", userController.getJurnalisById);
userRouter.get("/getUserById/:id", userController.getUserById);
userRouter.put("/profileUser/:id", userController.updateUserProfile);
userRouter.put("/profileJurnalis/:id", userController.updateJurnalisProfile);

module.exports = userRouter;
