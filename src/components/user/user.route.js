import express from "express";
const userRouter = express.Router();

import { register, userLogin } from "./user.controller.js";
import { protect } from "../../middleware/auth2.js";

userRouter.post("/register", register);
userRouter.post("/login", userLogin);

export default userRouter;
