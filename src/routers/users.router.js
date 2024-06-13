import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { UserRepository } from '../repositories/users.repository.js';
import { UserService } from '../services/users.service.js';
import { UserController } from '../controllers/users.controller.js';

const userRouter = express.Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// 내 정보 조회 API
userRouter.get('/mypage', userController.getMyInfo);

export { userRouter };
