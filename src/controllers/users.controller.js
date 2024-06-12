import { UsersService } from '../services/users.service.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UsersController {
  usersService = new UsersService();

  getMyInfo = async (req, res, next) => {
    try {
      // 사용자 정보 가져오기
      const { userId, email, name, role, createdAt, updatedAt } = req.user;

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.READ_ME.SUCCEED,
        data: {
          userId,
          email,
          name,
          role,
          createdAt,
          updatedAt,
        },
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };
}
