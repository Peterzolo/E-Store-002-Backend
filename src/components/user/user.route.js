import express from 'express';
const userRouter = express.Router();

import {
  fetchAllUsers,
  fetchUserDetails,
  register,
  updateUserprofile,
  userLogin,
} from './user.controller.js';
import { protect } from '../../middleware/auth2.js';

userRouter.post('/register', register);
userRouter.post('/login', userLogin);
userRouter.get('/fetch-all', fetchAllUsers);
userRouter.get('/fetch-one/:id', fetchUserDetails);
userRouter.put('/update/profile', protect, updateUserprofile);

export default userRouter;
