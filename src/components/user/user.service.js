import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { findUserByEmail, saveUserPayload } from './user.dao.js';
import ApiError from '../../error/ApiError.js';

export const createUser = async ({
  email,
  username,
  password,
  isAdmin,
  status,
}) => {
  const findUser = await findUserByEmail({ email });
  if (findUser) {
    throw ApiError.userExists({ message: 'User already exists' });
  }
  const userObject = {
    email,
    username,
    password,
    isAdmin,
    status,
  };

  const savedUser = await saveUserPayload(userObject);

  const payload = {
    _id: savedUser._id,
    email: savedUser.email,
    username: savedUser.username,
    isAdmin: savedUser.isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return {
    email: savedUser.email,
    username: savedUser.username,
    _id: savedUser._id,
    isAdmin: savedUser.isAdmin,
    token,
    status,
  };
};

export const signIn = async (email, password) => {
  const user = await findUserByEmail({ email });

  if (!user) {
    throw ApiError.notFound({ message: 'User does not exist' });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw ApiError.wrongCredential({ message: 'Wrong credential' });
  }
  if (user.status !== 'active') {
    throw ApiError.notFound({ message: 'User does not exist' });
  }

  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return {
    email: user.email,
    username: user.username,
    _id: user._id,
    isAdmin: user.isAdmin,
    token,
  };
};
