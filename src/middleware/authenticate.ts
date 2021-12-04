import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET as string, (err: any, user: any) => {
    if (err)
      return res.status(403).json({
        message: 'Unathourized',
      });
    req.user = user;

    next();
  });
};
