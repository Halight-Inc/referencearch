import db from './database';
import { User } from './database/models/user';

const seed = async (): Promise<void> => {
  try {
    console.log('Starting seed process...');
    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: true }); // Sync models, drop and recreate
    console.log('Database synced successfully.');

    // Check if users exist and create them if not
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword',
      });
      console.log('Admin User created.');
    } else {
      console.log('Admin User already exists.');
    }

    const userExists = await User.findOne({ where: { email: 'user@example.com' } });
    if (!userExists) {
      await User.create({
        name: 'User',
        email: 'user@example.com',
        password: 'password123',
      });
      console.log('User created.');
    } else {
      console.log('User already exists.');
    }

    console.log('Seed process completed.');
  } catch (error) {
    console.error('Error during seed process:', error);
  }
};

export default seed;

// Run the seed script if it's executed directly
if (require.main === module) {
  seed();
}
