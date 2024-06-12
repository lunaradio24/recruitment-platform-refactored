import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from '../constants/env.constant';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../constants/auth.constant';

// Access Token을 생성하는 함수
export const createAccessToken = (payload) => {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, ACCESS_TOKEN_EXPIRES_IN);
  return accessToken;
};

// Refresh Token을 생성하는 함수
export const createRefreshToken = (payload) => {
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, REFRESH_TOKEN_EXPIRES_IN);
  return refreshToken;
};
