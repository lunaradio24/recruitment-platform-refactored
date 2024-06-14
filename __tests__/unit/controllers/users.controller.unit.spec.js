import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { UserController } from '../../../src/controllers/users.controller.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { HttpError } from '../../../src/errors/http.error.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

const mockUserService = {
  getMyInfo: jest.fn(),
};

const mockRequest = {
  user: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const userController = new UserController(mockUserService);

describe.each(dummyUsers.slice(1))('UserController Unit Test', (dummyUser) => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    mockRequest.user = dummyUser;
    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
    mockResponse.json.mockReturnValue(mockResponse);
  });

  // 내 정보 조회
  describe('getMyInfo Method', () => {
    test('내 정보 조회 성공', async () => {
      // GIVEN
      const expectedUser = mockRequest.user;
      const expectedUserInfo = {
        userId: expectedUser.id,
        email: expectedUser.email,
        name: expectedUser.name,
        role: expectedUser.role,
        createdAt: expectedUser.createdAt,
        updatedAt: expectedUser.updatedAt,
      };
      const expectedResponse = {
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.READ_ME.SUCCEED,
        data: expectedUserInfo,
      };

      // WHEN
      await userController.getMyInfo(mockRequest, mockResponse, mockNext);

      // THEN
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('내 정보 조회 실패', async () => {
      // GIVEN
      mockRequest.user = undefined;
      const error = new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);

      // WHEN
      await userController.getMyInfo(mockRequest, mockResponse, mockNext);

      // THEN
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
