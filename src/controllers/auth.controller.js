import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  signUp = async (req, res, next) => {
    try {
      // 요청 정보 가져오기
      const { email, password, name } = req.body;

      // Service Layer에 회원가입 로직 요청
      const createdUser = await this.authService.signUp(email, password, name);

      // 반환 정보
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        data: createdUser,
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req, res, next) => {
    try {
      // 요청 정보 가져오기
      const { email, password } = req.body;

      // Service Layer에 로그인 로직 요청
      const tokens = await this.authService.signIn(email, password);

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
        data: tokens,
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };

  signOut = async (req, res, next) => {
    try {
      // 인증 정보 가져오기
      const { id: userId } = req.user;

      // Service Layer에 로그아웃 로직 요청
      await this.authService.signOut(userId);

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
        data: { userId: userId },
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };

  renewTokens = async (req, res, next) => {
    try {
      // 인증 정보 가져오기
      const { id: userId } = req.user;

      // Service Layer에 토큰 재발급 로직 요청
      const tokens = await this.authService.renewTokens(userId);

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.RENEW_TOKENS.SUCCEED,
        data: tokens,
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };
}
