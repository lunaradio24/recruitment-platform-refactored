export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getMyInfo = async (userId) => {
    const user = await this.userRepository.findUserById(userId);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };
}
