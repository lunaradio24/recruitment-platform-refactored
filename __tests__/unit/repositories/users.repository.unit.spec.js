import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { UserRepository } from '../../../src/repositories/users.repository.js';
import { dummyUsers } from '../../dummies/users.dummy.js';

// Mock Prisma Client
const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

const userRepository = new UserRepository(mockPrisma);

describe('UserRepository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다
  });

  // 사용자 정보 생성
  test('createUser Method', async () => {
    // GIVEN
    const signingUpUser = dummyUsers[0];
    const { email, password, name } = signingUpUser;
    mockPrisma.user.create.mockResolvedValue(signingUpUser);

    // WHEN
    const createdUser = await userRepository.createUser(email, password, name);

    // THEN
    expect(createdUser).toEqual(signingUpUser);
    expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: { email, password, name } });
  });

  // 사용자 id로 사용자 찾기
  test.each(dummyUsers.slice(1))('findUserById Method', async (dummyUser) => {
    // GIVEN
    const expectedUser = dummyUser;
    const userId = expectedUser.id;
    mockPrisma.user.findUnique.mockResolvedValue(expectedUser);

    // WHEN
    const foundUser = await userRepository.findUserById(userId);

    // THEN
    expect(foundUser).toEqual(expectedUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
  });

  // email로 사용자 찾기
  test.each(dummyUsers.slice(1))('findUserByEmail Method', async (dummyUser) => {
    // GIVEN
    const expectedUser = dummyUser;
    const email = expectedUser.email;
    mockPrisma.user.findUnique.mockResolvedValue(expectedUser);

    // WHEN
    const foundUser = await userRepository.findUserByEmail(email);

    // THEN
    expect(foundUser).toEqual(expectedUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: email } });
  });
});
