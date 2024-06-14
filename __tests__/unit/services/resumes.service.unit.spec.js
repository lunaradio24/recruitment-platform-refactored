import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumeService } from '../../../src/services/resumes.service.js';

const mockResumeRepository = {
  create: jest.fn(),
  readMany: jest.fn(),
  readOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const resumeService = new ResumeService(mockResumeRepository);

describe('ResumeService Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  describe('createResume Method', () => {
    test('성공', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });

  describe('getResumeList Method', () => {
    test('성공 - RECRUITER', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('성공 - APPLICANT', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('성공 - status 쿼리가 유효한 status인 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('성공 - status 쿼리가 유효하지 않은 status인 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('성공 - status 쿼리가 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('성공 - sort 쿼리가 유효한 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('성공 - sort 쿼리가 유효하지 않은 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('성공 - sort 쿼리가 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('성공 - 조회 결과가 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });

  describe('getResumeById Method', () => {
    test('성공 - RECRUITER', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('성공 - APPLICANT', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('실패 - 이력서 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('실패 - APPLICANT, 작성자와 일치하지 않는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });

  describe('updateResume Method', () => {
    test('성공', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('실패 - 이력서 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('실패 - 작성자와 일치하지 않는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });

  describe('deleteResume Method', () => {
    test('성공', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('실패 - 이력서 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('실패 - 작성자와 일치하지 않는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });

  describe('updateStatus Method', () => {
    test('성공', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('실패 - 이력서 없는 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });

    test('실패 - 변경할 지원 상태가 이전과 동일한 경우', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });

  describe('getResumeLogs Method', () => {
    test('성공', async () => {
      // GIVEN
      // WHEN
      // THEN
    });
  });
});
