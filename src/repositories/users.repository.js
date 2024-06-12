import { prisma } from '../utils/prisma.util.js';

export class UsersRepository {
  findAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
  };

  findUserById = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  };

  findUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({ where: { email: email } });
    return user;
  };

  createUser = async (email, password, name) => {
    const createdUser = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
    return createdUser;
  };
}
