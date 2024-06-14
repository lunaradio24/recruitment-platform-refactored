import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';
import { AuthService } from '../../../src/services/auth.service.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { HttpError } from '../../../src/errors/http.error.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
// import { bcrypt } from '../../__mocks__/bcrypt.js';

// bcrypt 모듈 모킹
jest.mock('bcrypt');

const mockUserRepository = {
  createUser: jest.fn(),
  findUserById: jest.fn(),
  findUserByEmail: jest.fn(),
};

const mockTokenRepository = {
  findRefreshTokenByUserId: jest.fn(),
  createRefreshToken: jest.fn(),
  updateRefreshToken: jest.fn(),
};

const authService = new AuthService(mockUserRepository, mockTokenRepository);

describe('AuthService Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  // 회원 가입
  describe('signUp Method', () => {
    test('회원가입 성공', async () => {
      // GIVEN
      const givenInput = dummyUsers[0];
      const { email, password, name } = givenInput;
      const expectedUser = {
        id: 1,
        email: email,
        password: `hashed_${password}`,
        name: name,
        role: 'APPLICANT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepository.findUserByEmail.mockResolvedValue(undefined);
      mockUserRepository.createUser.mockResolvedValue(expectedUser);
      bcrypt.hash.mockResolvedValue(`hashed_${password}`);

      // WHEN
      const createdUser = await authService.signUp(email, password, name);

      // THEN
      expect(createdUser).toEqual({
        userId: expectedUser.id,
        email: expectedUser.email,
        name: expectedUser.name,
        role: expectedUser.role,
        createdAt: expectedUser.createdAt,
      });
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(email, `hashed_${password}`, name);
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(email);
    });

    test('이메일 중복인 경우', async () => {
      // GIVEN
      const givenInput = dummyUsers[0];
      const { email, password, name } = givenInput;
      const existingUser = dummyUsers[1];
      mockUserRepository.findUserByEmail.mockResolvedValue(existingUser);

      // WHEN
      try {
        await authService.signUp(email, password, name);
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(HttpError.BadRequest);
        expect(error.message).toBe(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
      }
    });
  });

  // 로그인
  describe('signIn Method', () => {
    test('로그인 성공', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('이메일로 조회되는 사용자가 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('입력한 비밀번호가 일치하지 않는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('DB에 Refresh Token이 있는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('DB에 Refresh Token이 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });

  // 로그아웃
  describe('signOut Method', () => {
    test('로그아웃 성공', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('토큰 soft delete 실패', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });

  // 토큰 재발급
  describe('renewTokens Method', () => {
    test('토큰 재발급 성공', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('userId로 조회되는 사용자가 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });
});
