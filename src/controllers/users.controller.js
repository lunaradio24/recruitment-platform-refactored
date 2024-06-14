import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getMyInfo = async (req, res, next) => {
    try {
      // 사용자 정보 가져오기
      const user = req.user;

      if (!user) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.READ_ME.SUCCEED,
        data: {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };
}
