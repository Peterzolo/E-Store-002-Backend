import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';

// export const protect = (req, res, next) => {
//   const authorization =
//     req.body.token ||
//     req.query.token ||
//     req.headers['x-access-token'] ||
//     req.headers.authorization;
//   if (authorization) {
//     const token = authorization.slice(7, authorization.length);
//     jwt.verify(
//       token,
//       process.env.JWT_SECRET || 'somethingsecret',
//       (err, decode) => {
//         if (err) {
//           res.status(401).send({ message: 'Invalid Token' });
//         } else {
//           req.userId = decode;
//           next();
//         }
//       }
//     );
//   } else {
//     res.status(401).send({ message: 'No Token' });
//   }
// };

export const protect = (req, res, next) => {
  const authHeader =

    req.headers['x-access-token'] ||
    req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json({ message: 'Token is not valid!' });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: 'You are not authenticated!' });
  }
};


export const registeredAndAuthorized = (req, res, next) => {
  protect(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

export const authorizedAndAdmin = (req, res, next) => {
  protect(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message:"You are not authorized to perform this task"});
    }
  });
};