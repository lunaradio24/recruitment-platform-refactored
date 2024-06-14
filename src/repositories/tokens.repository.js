export class TokenRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findRefreshTokenByUserId = async (userId) => {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { userId: userId },
    });
    return refreshToken;
  };

  createRefreshToken = async (userId, refreshToken) => {
    await this.prisma.refreshToken.create({
      data: {
        userId: userId,
        token: refreshToken,
      },
    });
  };

  updateRefreshToken = async (userId, refreshToken) => {
    await this.prisma.refreshToken.update({
      where: { userId: userId },
      data: { token: refreshToken },
    });
  };
}
