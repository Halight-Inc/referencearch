import { getRepository } from 'typeorm';
import { User } from '../models/user';

export const seedUsers = async () => {
    const userRepository = getRepository(User);

    const user = new User();
    user.username = 'admin';
    await user.setPassword('admin123');
    await userRepository.save(user);

    console.log('Seeded user: admin');
};