import express from 'express';
import bcrypt from 'bcrypt';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { EMAIL_REGEX, SALT_ROUNDS } from '../constants.constant.js';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { createAccessToken, createRefreshToken } from '../utils.util.js';
import { CustomError } from '../utils/custom-error.util.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

const authRouter = express.Router();

/*****     회원가입 API     *****/
authRouter.post('/sign-up', signUpValidator, async (req, res, next) => {
  try {
    // 1. Request Body에서 요청 정보 가져오기
    const { email, password, passwordConfirm, name } = req.body;

    // 2. 유효성 검증 및 에러 처리
    // - 회원 정보 중 하나라도 빠진 경우
    if (!email) throw new CustomError(HTTP_STATUS.BAD_REQUEST, 'email을 입력해 주세요.');
    if (!password) throw new CustomError(HTTP_STATUS.BAD_REQUEST, '비밀번호을 입력해 주세요.');
    if (!passwordConfirm) throw new CustomError(HTTP_STATUS.BAD_REQUEST, '비밀번호 확인을 입력해 주세요.');
    if (!name) throw new CustomError(HTTP_STATUS.BAD_REQUEST, '이름을 입력해 주세요.');

    // - 이메일 형식에 맞지 않는 경우
    if (!EMAIL_REGEX.test(email)) throw new CustomError(HTTP_STATUS.BAD_REQUEST, '이메일 형식이 올바르지 않습니다.');

    //  - 비밀번호가 6자리 미만인 경우
    if (password.length < 6) throw new CustomError(HTTP_STATUS.BAD_REQUEST, '비밀번호는 6자리 이상이어야 합니다.');
    if (password !== passwordConfirm)
      throw new CustomError(HTTP_STATUS.BAD_REQUEST, '입력한 두 비밀번호가 일치하지 않습니다.');

    // - 이메일이 중복되는 경우
    const existedUser = await prisma.users.findUnique({ where: { email: email } });
    if (existedUser) throw new CustomError(HTTP_STATUS.BAD_REQUEST, '이미 가입된 사용자입니다.');

    // 3. 비즈니스 로직(데이터 처리)
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const createdUser = await prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });

    // 4. 반환 정보
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data: {
        userId: createdUser.id,
        email: email,
        name: name,
        role: createdUser.role,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      },
    });

    // 5. 발생한 에러는 catch로 받아서 미들웨어에서 처리
  } catch (error) {
    next(error);
  }
});

/*****     로그인 API     *****/
authRouter.post('/sign-in', signInValidator, async (req, res, next) => {
  try {
    // 1. Request Body에서 요청정보 가져오기
    const { email, password } = req.body;

    // 2. 유효성 검증 및 에러 처리
    //  - 로그인 정보 중 하나라도 빠진 경우
    if (!email) throw new CustomError(HTTP_STATUS.BAD_REQUEST, 'email을 입력해 주세요.');
    if (!password) throw new CustomError(HTTP_STATUS.BAD_REQUEST, '비밀번호을 입력해 주세요.');

    //  - 이메일 형식에 맞지 않는 경우
    if (!EMAIL_REGEX.test(email)) throw new CustomError(HTTP_STATUS.BAD_REQUEST, '이메일 형식이 올바르지 않습니다.');

    //  - 이메일로 조회되지 않거나 비밀번호가 일치하지 않는 경우
    const user = await prisma.users.findUnique({ where: { email: email } });
    const isPasswordMatched = user ? await bcrypt.compare(password, user.password) : null;
    if (!user || !isPasswordMatched) throw new CustomError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.COMMON.UNAUTHORIZED);

    // 3. 토큰 발급
    // Access, Refresh Token 발급
    const payload = { userId: user.id };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);
    const saltedToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    // DB의 refreshTokens 테이블에 Refresh Token이 이미 있는지 확인
    const existingToken = await prisma.refreshTokens.findFirst({ where: { userId: user.id } });
    // 없다면, 새로 발급한 Refresh Token을 DB에 저장
    if (!existingToken) {
      await prisma.refreshTokens.create({
        data: {
          userId: user.id,
          token: saltedToken,
        },
      });
    }
    // 있다면, 새로 발급한 Refresh Token으로 갱신
    else {
      await prisma.refreshTokens.update({
        where: { userId: user.id },
        data: { token: saltedToken },
      });
    }
    // 4. 반환 정보 - AccessToken, RefreshToken을 반환
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data: { accessToken, refreshToken },
    });

    // 5. 발생한 에러는 catch로 받아서 미들웨어에서 처리
  } catch (error) {
    next(error);
  }
});

/*****     로그아웃 API     *****/
authRouter.post('/sign-out', requireRefreshToken, async (req, res, next) => {
  try {
    // 1. 인증 Middleware를 통해서 사용자 정보 가져오기
    const { id: userId } = req.user;

    // 2. DB에서 RefreshToken을 삭제
    await prisma.refreshTokens.delete({ where: { userId: userId } });

    // 3. 반환 정보
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
      data: { userId: userId },
    });

    // 4. 발생한 에러는 catch로 받아서 미들웨어에서 처리
  } catch (error) {
    next(error);
  }
});

/*****     토큰 재발급 API     *****/
authRouter.post('/renew', requireRefreshToken, async (req, res, next) => {
  try {
    // 1. 인증 Middleware를 통해서 사용자 정보 가져오기
    const { id: userId } = req.user;

    // 2. AccessToken, RefreshToken 재발급
    const newAccessToken = createAccessToken(userId);
    const newRefreshToken = createRefreshToken(userId);
    const saltedToken = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);

    // DB에 저장된 RefreshToken을 갱신
    await prisma.refreshTokens.update({
      where: { userId: userId },
      data: { token: saltedToken },
    });

    // 3. 반환 정보 - AccessToken, RefreshToken을 반환
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.RENEW_TOKENS.SUCCEED,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });

    // 4. 발생한 에러는 catch로 받아서 미들웨어에서 처리
  } catch (error) {
    next(error);
  }
});

export { authRouter };
