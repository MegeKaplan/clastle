import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import app from '../../app.js';
import argon2 from 'argon2';

export interface AccessTokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, app.config.JWT_SECRET, { expiresIn: '15m' });
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