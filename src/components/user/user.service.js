import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { findUserByEmail, saveUserPayload } from "./user.dao.js";
import ApiError from "../../error/ApiError.js";

export const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  status,
}) => {
  const findUser = await findUserByEmail({ email });
  if (findUser) {
    // throw ApiError.userExist({ message: "User already exists" });
    throw ApiError.userExists({ message: "User already exists" });
  }
  const userObject = {
    firstName,
    lastName,
    email,
    password,
    status,
  };

  const savedUser = await saveUserPayload(userObject);

  const payload = {
    _id: savedUser._id,
    email: savedUser.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    firstName: savedUser.firstName,
    lastName: savedUser.lastName,
    email: savedUser.email,
    _id: savedUser._id,
    token,
    status,
  };
};

export const signIn = async (email, password) => {
  const user = await findUserByEmail({ email });

  if (!user) {
    throw ApiError.notFound({ message: "User does not exist" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw ApiError.wrongCredential({ message: "Wrong credential" });
  }
  if (user.status !== "active") {
    throw ApiError.notFound({ message: "User does not exist" });
  }

  const payload = {
    _id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    _id: user._id,
    token,
  };
};
