import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.util.js';
import { CustomError } from '../utils/custom-error.util.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { REFRESH_TOKEN_SECRET_KEY } from '../constants/env.constant.js';

const requireRefreshToken = async (req, res, next) => {
  try {
    // 인증 정보 파싱
    const authorization = req.headers.authorization;

    // Authorization이 없는 경우
    if (!authorization) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN,
      });
    }

    // JWT 표준 인증 형태와 일치하지 않는 경우
    const [type, refreshToken] = authorization.split(' ');

    if (type !== 'Bearer') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE,
      });
    }

    // 3. 비즈니스 로직(데이터 처리)
    //  - Payload에 담긴 사용자 ID를 이용하여 사용자 정보를 조회합니다.
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY) ?? null;
    const { userId } = payload;
    const user = await prisma.users.findUnique({ where: { id: userId } });

    //  - Payload에 담긴 사용자 ID와 일치하는 사용자가 없는 경우
    if (!user) throw new CustomError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.COMMON.JWT.NO_USER);

    //   - 사용자가 가지고 있는 RefreshToken이 DB에 저장된 것과 일치하는지 확인
    const { token: savedRefreshToken } = await prisma.refreshTokens.findUnique({
      where: { userId: userId },
    });
    const isPasswordMatched = await bcrypt.compare(refreshToken, savedRefreshToken);
    if (!isPasswordMatched) throw new CustomError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.COMMON.JWT.INVALID);

    // 4. 반환 정보
    req.user = user;
    next();

    // 5. 발생한 에러는 catch로 받아서 다음 미들웨어에서 처리
  } catch (error) {
    next(error);
  }
};

export { requireRefreshToken };
