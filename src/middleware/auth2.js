import jwt from "jsonwebtoken";
import ApiError from "../error/ApiError.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('Token',token)
      if (!token) {
       res.send({message : "You are not authorized to perform this task"})
      } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded?._id;
        req.isAdmin = decoded.isAdmin;
        req.email = decoded.email
        next();
      }
    } catch (error) {
      console.log(error.message);
      res.status(401).json(error.message);
    }
  }
};
