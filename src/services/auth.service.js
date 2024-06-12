import { UsersRepository } from '../repositories/users.repository.js';
import { TokensRepository } from '../repositories/tokens.repository.js';
import { CustomError } from '../utils/custom-error.util.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import bcrypt from 'bcrypt';
import { MESSAGES } from '../constants/message.constant.js';
import { SALT_ROUNDS } from '../constants/auth.constant.js';
import { generateAccessToken, generateRefreshToken } from '../utils/auth.util.js';

export class AuthService {
  usersRepository = new UsersRepository();
  tokensRepository = new TokensRepository();

  signUp = async (email, password, name) => {
    // 이메일이 중복 여부 확인
    const existingUser = await this.usersRepository.findUserByEmail(email);
    if (existingUser) throw new CustomError(HTTP_STATUS.BAD_REQUEST, MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const createdUser = await this.usersRepository.createUser(email, hashedPassword, name);

    // 반환 정보
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
    const user = await this.usersRepository.findUserByEmail(email);
    const isPasswordMatched = user ? await bcrypt.compare(password, user.password) : null;
    if (!user || !isPasswordMatched) throw new CustomError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.COMMON.UNAUTHORIZED);

    // Access, Refresh Token 발급
    const payload = { userId: user.id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const saltedToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    // DB의 refreshTokens 테이블에 Refresh Token이 이미 있는지 확인
    const existingToken = await this.tokensRepository.findRefreshTokenByUserId(user.id);

    // 없다면(없다면) 새로 발급한 Refresh Token을(으로) DB에 저장(갱신)
    if (!existingToken) await this.tokensRepository.createRefreshToken(user.id, saltedToken);
    else await this.tokensRepository.updateRefreshToken(user.id, saltedToken);

    // 반환 정보
    return { accessToken, refreshToken };
  };

  signOut = async (userId) => {
    // DB에서 RefreshToken을 삭제(soft delete)
    await this.tokensRepository.updateRefreshToken(userId, null);
  };

  renewTokens = async (userId) => {
    // 사용자 id로 조회되지 않는 경우
    const user = await this.usersRepository.findUserById(userId);
    if (!user) throw new CustomError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.COMMON.UNAUTHORIZED);

    // AccessToken, RefreshToken 재발급
    const payload = { userId: user.id };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    const saltedToken = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);

    // DB에 저장된 RefreshToken을 갱신
    await this.tokensRepository.updateRefreshToken(userId, saltedToken);

    // 반환 정보
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  };
}
