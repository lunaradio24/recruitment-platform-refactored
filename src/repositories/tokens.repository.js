import { prisma } from '../utils/prisma.util.js';

export class TokensRepository {
  findRefreshTokenByUserId = async (userId) => {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { userId: userId },
    });
    return refreshToken;
  };

  createRefreshToken = async (userId, refreshToken) => {
    await prisma.refreshToken.create({
      data: {
        userId: userId,
        token: refreshToken,
      },
    });
  };

  updateRefreshToken = async (userId, refreshToken) => {
    await prisma.refreshToken.update({
      where: { userId: userId },
      data: { token: refreshToken },
    });
  };

  deleteRefreshToken = async (userId) => {
    await prisma.refreshToken.delete({
      where: { userId: userId },
    });
  };
}
