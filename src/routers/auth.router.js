import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { UserRepository } from '../repositories/users.repository.js';
import { TokenRepository } from '../repositories/tokens.repository.js';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controllers/auth.controller.js';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';

const authRouter = express.Router();

const userRepository = new UserRepository(prisma);
const tokenRepository = new TokenRepository(prisma);
const authService = new AuthService(userRepository, tokenRepository);
const authController = new AuthController(authService);

// 회원가입 API
authRouter.post('/sign-up', signUpValidator, authController.signUp);

// 로그인 API
authRouter.post('/sign-in', signInValidator, authController.signIn);

// 로그아웃 API
authRouter.post('/sign-out', requireRefreshToken, authController.signOut);

// 토큰 재발급 API
authRouter.post('/renew-tokens', requireRefreshToken, authController.renewTokens);

export { authRouter };
