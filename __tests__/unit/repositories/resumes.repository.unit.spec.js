import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { ResumeRepository } from '../../../src/repositories/resumes.repository.js';

const mockPrisma = {
  template: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const resumeRepository = new ResumeRepository(mockPrisma);

describe('ResumeRepository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다
  });

  test('createResume Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('findAllResumes Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('findResumeById Method', async () => {
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

  test('findResumeLogs Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });
});
