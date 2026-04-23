import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { AccessTokenPayload } from '../../common/types/auth.js';

// export type AccessTokenPayload = {
//   userId: string;
//   email: string;
//   role: Role;
// }
export type { AccessTokenPayload };

export const generateAccessToken = (payload: AccessTokenPayload, secret: string) => {
  return jwt.sign(payload, secret, { expiresIn: '15m' });
};

export const generateRefreshToken = () => {
  return randomBytes(20).toString('hex');
};

export const hashPassword = async (password: string) => {
  return await argon2.hash(password);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await argon2.verify(hash, password);
};