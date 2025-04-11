import { Sequelize } from 'sequelize';
import config from '../config/config';
import { initUser, User } from './models/user';
import { initItem, Item } from './models/item';
//import { initCoachonCuePersona, CoachonCuePersona } from './models/coachoncue_personas';
import { initCoachonCueScenario, CoachonCueScenario } from './models/coachoncue_scenarios';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  logging: console.log,
});

// Init models
initUser(sequelize);
initItem(sequelize);
//initCoachonCuePersona(sequelize);
initCoachonCueScenario(sequelize);

// Final model registration (ensures Sequelize knows about them)
sequelize.models.User = User;
sequelize.models.Item = Item;
//sequelize.models.CoachonCuePersona = CoachonCuePersona;
sequelize.models.CoachonCueScenario = CoachonCueScenario;

export default {
  sequelize,
  User,
  Item,
  //CoachonCuePersona,
  CoachonCueScenario
};
