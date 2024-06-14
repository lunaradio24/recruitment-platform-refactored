import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumeController } from '../../../src/controllers/resumes.controller.js';

const mockResumeService = {
  create: jest.fn(),
  readMany: jest.fn(),
  readOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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

const resumeController = new ResumeController(mockResumeService);

describe('ResumeController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('createResume Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('getResumeList Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('getResumeById Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('updateResume Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('deleteResume Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('updateStatus Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('getResumeLogs Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });
});
