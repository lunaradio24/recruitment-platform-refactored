import { prisma } from '../utils/prisma.util.js';

export class TokensRepository {
  findRefreshTokenByUserId = async (userId) => {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { userId: userId },
    });
    return refreshToken;
  };

  createRefreshToken = async (userId, refreshToken) => {
    const createdToken = await prisma.refreshToken.create({
      data: {
        userId: userId,
        token: refreshToken,
      },
    });
    return createdToken;
  };

  updateRefreshToken = async (userId, refreshToken) => {
    const updatedToken = await prisma.refreshToken.update({
      where: { userId: userId },
      data: { token: refreshToken },
    });
    return updatedToken;
  };

  deleteRefreshToken = async (userId) => {
    const deletedToken = await prisma.refreshToken.delete({
      where: { userId: userId },
    });
    return deletedToken;
  };
}
