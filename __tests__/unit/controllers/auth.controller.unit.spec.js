import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthController } from '../../../src/controllers/auth.controller.js';
import { EMAIL_REG_EX, MIN_PASSWORD_LENGTH } from '../../../src/constants/auth.constant.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

const mockAuthService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  renewTokens: jest.fn(),
};

const mockRequest = {
  user: jest.fn(),
  body: jest.fn(),
  query: jest.fn(),
  params: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const authController = new AuthController(mockAuthService);

describe('AuthController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('signUp Method', async () => {
    // GIVEN
    const givenInput = dummyUsers[0];
    const expectedUser = dummyUsers[1];
    mockRequest.body = { email: givenInput.email, password: givenInput.password, name: givenInput.name };
    expect(mockRequest.body.email).toBeDefined();
    expect(mockRequest.body.password).toBeDefined();
    expect(mockRequest.body.name).toBeDefined();
    expect(EMAIL_REG_EX.test(mockRequest.body.email)).toBe(true);
    expect(mockRequest.body.password.length >= MIN_PASSWORD_LENGTH).toBe(true);
    mockAuthService.signUp.mockResolvedValue(expectedUser);

    // WHEN
    const createdUser = await authController.signUp(mockRequest, mockResponse, mockNext);

    // THEN
    expect(createdUser).toEqual(expectedUser);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data: createdUser,
    });
  });

  test('signIn Method', async () => {
    // GIVEN
    mockRequest.body = { email: dummyUsers[0].email, password: dummyUsers[0].password };
    expect(mockRequest.body.email).toBeDefined();
    expect(mockRequest.body.password).toBeDefined();

    // WHEN
    // THEN
  });

  test('signOut Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('renewTokens Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });
});
