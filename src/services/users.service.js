import { UsersRepository } from '../repositories/users.repository.js';

export class UsersService {
  usersRepository = new UsersRepository();

  getMyInfo = async (userId) => {
    const user = await this.usersRepository.findUserById(userId);
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };
}
