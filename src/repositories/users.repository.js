export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createUser = async (email, password, name) => {
    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
    return createdUser;
  };

  findUserById = async (userId) => {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user;
  };

  findUserByEmail = async (email) => {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    return user;
  };
}
