import db from './../../database/index';

const { sequelize, User, CoachonCueScenario } = db;

console.log('Models known to Sequelize:', Object.keys(sequelize.models)); // debugging

const seed = async (): Promise<void> => {
  try {
    console.log('Models before sync:', Object.keys(sequelize.models));
    console.log('Starting seed process...');
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Drop and recreate tables
    console.log('Database synced successfully.');

    // --- Seed Admin User ---
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

    // --- Seed Regular User ---
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

    // --- Seed Scenario: Conducting 1-on-1 ---
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
        guidelines: ['keep the conversation focused'],
        coachingFramework: {
          name: 'G.R.O.W.',
          description:
            'A widely used coaching model focusing on Goal, Reality, Options, and Will. Encourages structured guidance and reflection.',
        },
        supportingMaterials: [],
        persona: {
          name: 'Alex',
          role: 'New Manager',
          disposition: 'Enthusiastic but anxious',
          background:
            'Recently promoted from individual contributor to team manager. Wants to succeed but lacks confidence in leadership abilities.',
          communicationStyle:
            'Speaks quickly, asks many questions, sometimes interrupts. Often seeks validation after decisions.',
          emotionalState: 'Excited but nervous. Eager to prove themselves worthy of the promotion.',
          avatar: '',
          avatarUrl: '',
        },
      });
      console.log('CoachonCue Scenario (conducting-1-on-1) created.');
    } else {
      console.log('CoachonCue Scenario (conducting-1-on-1) already exists.');
    }

    // --- Seed Scenario: Difficult Teammates ---
    const difficultTeammatesExists = await CoachonCueScenario.findOne({
      where: { scenarioType: 'difficult-teammates' },
    });

    if (!difficultTeammatesExists) {
      await CoachonCueScenario.create({
        scenarioType: 'difficult-teammates',
        keyTopics: ['Empathy', 'Setting boundaries', 'Managing emotional responses'],
        competenciesAndGoals: [
          'Demonstrate active listening',
          'Maintain professionalism under pressure',
          'De-escalate tense situations',
        ],
        guidelines: ['Pretend to be an irate coworker'],
        coachingFramework: {
          name: 'G.R.O.W.',
          description:
            'A widely used coaching model focusing on Goal, Reality, Options, and Will. Encourages structured guidance and reflection.',
        },
        supportingMaterials: [],
        persona: {
          name: 'Taylor',
          role: 'Team Lead',
          disposition: 'Authoritative and direct',
          background:
            'Experienced professional with high standards. Values efficiency and clear communication above all else.',
          communicationStyle:
            'Direct, concise, and sometimes blunt. Prefers facts over feelings. Limited patience for tangents.',
          emotionalState:
            'Calm and focused. Can appear cold when stressed or when facing project delays.',
        },
      });
      console.log('CoachonCue Scenario (difficult-teammates) created.');
    } else {
      console.log('CoachonCue Scenario (difficult-teammates) already exists.');
    }

    // --- Seed Scenario: Performance Review ---
    const performanceReviewExists = await CoachonCueScenario.findOne({
      where: { scenarioType: 'performance-review' },
    });

    if (!performanceReviewExists) {
      await CoachonCueScenario.create({
        scenarioType: 'performance-review',
        keyTopics: ['Active listening', 'Setting expectations', 'Critical feedback'],
        competenciesAndGoals: [
          'Use effective questioning techniques',
          'Show empathy and understanding',
        ],
        guidelines: [
          'focus on the employees strengths while provided some targeted constructive feedback',
        ],
        coachingFramework: {
          name: 'O.S.K.A.R.',
          description:
            'Outcome, Scaling, Know-how, Affirm & Action, Review. A solution-focused coaching approach that emphasizes positive outcomes.',
        },
        supportingMaterials: [],
        persona: {
          name: 'Alex',
          role: 'New Manager',
          disposition: 'Enthusiastic but anxious',
          background:
            'Recently promoted from individual contributor to team manager. Wants to succeed but lacks confidence in leadership abilities.',
          communicationStyle:
            'Speaks quickly, asks many questions, sometimes interrupts. Often seeks validation after decisions.',
          emotionalState: 'Excited but nervous. Eager to prove themselves worthy of the promotion.',
        },
      });
      console.log('CoachonCue Scenario (performance-review) created.');
    } else {
      console.log('CoachonCue Scenario (performance-review) already exists.');
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Error during seed process:', error);
  }
};

export default seed;

if (require.main === module) {
  seed();
}
