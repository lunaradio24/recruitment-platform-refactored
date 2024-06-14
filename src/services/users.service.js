import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getMyInfo = async (userId) => {
    const user = await this.userRepository.findUserById(userId);
    // 사용자 id로 조회되지 않는 경우
    if (!user) throw new HttpError.NotFound(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };
}
