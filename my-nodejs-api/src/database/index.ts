import { Sequelize } from 'sequelize';
import config from '../config/config';
import { initUser, User } from './models/user';
import { initItem, Item } from './models/item';
import { initScenario, Scenario } from './models/scenarios';
import { initScenarioFile, ScenarioFile } from './models/scenario_files';
import { initSimulation, Simulation } from './models/simulation';

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
initScenario(sequelize);
initScenarioFile(sequelize);
initSimulation(sequelize);

Scenario.hasMany(ScenarioFile);
ScenarioFile.belongsTo(Scenario);
Simulation.hasMany(Scenario);
Simulation.hasMany(User)

// Final model registration (ensures Sequelize knows about them)
sequelize.models.User = User;
sequelize.models.Item = Item;
sequelize.models.Scenario = Scenario;
sequelize.models.ScenarioFile = ScenarioFile;
sequelize.models.Simulation = Simulation;

export default {
  sequelize,
  User,
  Item,
  Scenario,
  ScenarioFile,
  Simulation,
};
