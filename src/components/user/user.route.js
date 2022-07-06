import express from "express";
const userRouter = express.Router();

import { fetchAllUsers, fetchUserDetails, register, userLogin } from "./user.controller.js";
import { protect } from "../../middleware/auth2.js";

userRouter.post("/register", register);
userRouter.post("/login", userLogin);
userRouter.get("/fetch-all", fetchAllUsers);
userRouter.get("/fetch-one/:id", fetchUserDetails);
userRouter.put("/profile", protect, fetchUserDetails);

export default userRouter;
