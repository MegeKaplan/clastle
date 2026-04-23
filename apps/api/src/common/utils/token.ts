import jwt from 'jsonwebtoken';

export const verifyAccessToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};