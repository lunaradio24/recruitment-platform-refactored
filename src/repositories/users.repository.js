export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllUsers = async () => {
    const users = await this.prisma.user.findMany();
    return users;
  };

  findUserById = async (userId) => {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user;
  };

  findUserByEmail = async (email) => {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    return user;
  };

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
}
