import express from 'express';
import { UsersController } from '../controllers/users.controller.js';

const userRouter = express.Router();

// UsersController의 인스턴스를 생성합니다.
const usersController = new UsersController();

// 내 정보 조회 API
userRouter.get('/mypage', usersController.getMyInfo);

export { userRouter };
