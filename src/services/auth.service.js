import { UsersRepository } from '../repositories/users.repository.js';
import { CustomError } from '../utils/custom-error.util.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants/auth.constant.js';

export class AuthService {
  usersRepository = new UsersRepository();

  signUp = async (email, password, name) => {
    // 이메일이 중복 여부 확인
    const existedUser = await this.usersRepository.findUserByEmail(email);
    if (existedUser) throw new CustomError(HTTP_STATUS.BAD_REQUEST, '이미 가입된 사용자입니다.');

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const createdUser = await this.usersRepository.createUser(email, hashedPassword, name);

    return {
      userId: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
    };
  };

  signIn = async (email, password) => {
    // 이메일로 조회되지 않거나 비밀번호가 일치하지 않는 경우
    // const user = await this.authService.usersRepository.findUserByEmail(email);
    // const isPasswordMatched = user ? await bcrypt.compare(password, user.password) : null;
    // if (!user || !isPasswordMatched) throw new CustomError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    // // 3. 토큰 발급
    // // Access, Refresh Token 발급
    // const payload = { userId: user.id };
    // const accessToken = createAccessToken(payload);
    // const refreshToken = createRefreshToken(payload);
    // const saltedToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    // // DB의 refreshTokens 테이블에 Refresh Token이 이미 있는지 확인
    // const existingToken = await prisma.refreshTokens.findFirst({ where: { userId: user.id } });
    // // 없다면, 새로 발급한 Refresh Token을 DB에 저장
    // if (!existingToken) {
    //   await prisma.refreshTokens.create({
    //     data: {
    //       userId: user.id,
    //       token: saltedToken,
    //     },
    //   });
    // }
    // // 있다면, 새로 발급한 Refresh Token으로 갱신
    // else {
    //   await prisma.refreshTokens.update({
    //     where: { userId: user.id },
    //     data: { token: saltedToken },
    //   });
    // }
    // // 4. 반환 정보 - AccessToken, RefreshToken을 반환
    // return { accessToken, refreshToken };
  };

  signOut = async () => {
    // 2. DB에서 RefreshToken을 삭제
    //     await prisma.refreshTokens.delete({ where: { userId: userId } });
  };
  renewTokens = async () => {
    // 2. AccessToken, RefreshToken 재발급
    //     const newAccessToken = createAccessToken(userId);
    //     const newRefreshToken = createRefreshToken(userId);
    //     const saltedToken = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);
    //     // DB에 저장된 RefreshToken을 갱신
    //     await prisma.refreshTokens.update({
    //       where: { userId: userId },
    //       data: { token: saltedToken },
    //     });
  };
}
