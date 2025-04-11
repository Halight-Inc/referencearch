import db from './../../database/index';

const { sequelize, User, CoachonCuePersona, CoachonCueScenario } = db;

console.log('Models known to Sequelize:', Object.keys(sequelize.models)); // added to debug why the new coachoncue tables arent being seeded 

const seed = async (): Promise<void> => {
  try {
    console.log('Models before sync:', Object.keys(sequelize.models)); //debugging seeding issues with the new coachoncue tables  - Mikey
    console.log('Starting seed process...');
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Sync models, drop and recreate
    console.log('Database synced successfully.');

    // Seed Admin User
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

    // Seed Regular User
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

    // Seed Persona
    const personaExists = await CoachonCuePersona.findOne({ where: { name: 'Alex', role: 'New Manager' } });
    let persona;

    if (!personaExists) {
      persona = await CoachonCuePersona.create({
        name: 'Alex',
        role: 'New Manager',
        disposition: 'Enthusiastic but anxious',
        background: 'Recently promoted from individual contributor to team manager. Wants to succeed but lacks confidence in leadership abilities.',
        communicationStyle: 'Speaks quickly, asks many questions, sometimes interrupts. Often seeks validation after decisions.',
        emotionalState: 'Excited but nervous. Eager to prove themselves worthy of the promotion.',
      });
      console.log('CoachonCue Persona created.');
    } else {
      persona = personaExists;
      console.log('CoachonCue Persona already exists.');
    }

    // Seed Scenario
    const scenarioExists = await CoachonCueScenario.findOne({
      where: {
        scenarioType: 'conducting-1-on-1',
      },
    });

    if (!scenarioExists) {
      await CoachonCueScenario.create({
        scenarioType: 'conducting-1-on-1',
        keyTopics: ['Active listening', 'Psychological safety', 'Empathy'],
        competenciesAndGoals: [
          'Demonstrate active listening',
          'Maintain professionalism under pressure',
          'De-escalate tense situations',
        ],
        guidelines: ['dont use aggressive language'],
        coachingFramework: {
          name: 'C.L.E.A.R.',
          description:
            'Contracting, Listening, Exploring, Action, Review. A coaching model that emphasizes establishing clear expectations and structured follow-up.',
        },
        supportingMaterials: [],
        // personaId: persona.id,
      });
      console.log('CoachonCue Scenario created.');
    } else {
      console.log('CoachonCue Scenario already exists.');
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