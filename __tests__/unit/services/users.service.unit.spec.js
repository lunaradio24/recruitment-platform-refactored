import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { UserService } from '../../../src/services/users.service.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { HttpError } from '../../../src/errors/http.error.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

const mockUserRepository = {
  findUserById: jest.fn(),
};

const userService = new UserService(mockUserRepository);

describe.each(dummyUsers.slice(1))('UserService Unit Test', (dummyUser) => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  describe('getMyInfo Method', () => {
    test('내 정보 조회 성공', async () => {
      // GIVEN
      const expectedUser = dummyUser;
      const userId = expectedUser.id;
      mockUserRepository.findUserById.mockResolvedValue(expectedUser);

      // WHEN
      const foundUser = await userService.getMyInfo(userId);

      // THEN
      expect(foundUser).toEqual({
        id: expectedUser.id,
        email: expectedUser.email,
        name: expectedUser.name,
        role: expectedUser.role,
        createdAt: expectedUser.createdAt,
        updatedAt: expectedUser.updatedAt,
      });
      expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findUserById).toHaveBeenCalledWith(userId);
    });

    test('Access Token 검증 미들웨어로부터 넘겨받은 req.user에 들어있는 userId로 조회되는 사용자가 없는 경우', async () => {
      // GIVEN
      const expectedUser = dummyUser;
      const nonExistentUserId = 999999999999;
      mockUserRepository.findUserById.mockResolvedValue(expectedUser);

      // WHEN
      try {
        await userService.getMyInfo(nonExistentUserId);
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(HttpError.NotFound);
        expect(error.message).toBe(MESSAGES.AUTH.COMMON.JWT.NO_USER);
      }
    });
  });
});
