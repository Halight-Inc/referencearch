// coachoncue_scenarios.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

interface CoachonCueScenarioAttributes {
  id?: number;

  // --- Scenario fields ---
  scenarioType: string;
  keyTopics: string[];
  competenciesAndGoals: string[];
  guidelines?: string[];
  coachingFramework: {
    name: string;
    description: string;
  };
  supportingMaterials?: string[];

  // --- Persona fields ---
  name: string;
  role: string;
  disposition: string;
  background: string;
  communicationStyle: string;
  emotionalState: string;
}

class CoachonCueScenario extends Model<CoachonCueScenarioAttributes> implements CoachonCueScenarioAttributes {
  public id!: number;

  // Scenario fields
  public scenarioType!: string;
  public keyTopics!: string[];
  public competenciesAndGoals!: string[];
  public guidelines?: string[];
  public coachingFramework!: { name: string; description: string };
  public supportingMaterials?: string[];

  // Persona fields
  public name!: string;
  public role!: string;
  public disposition!: string;
  public background!: string;
  public communicationStyle!: string;
  public emotionalState!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initCoachonCueScenario = (sequelize: Sequelize): void => {
  CoachonCueScenario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // Scenario fields
      scenarioType: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      keyTopics: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      competenciesAndGoals: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      guidelines: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      coachingFramework: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      supportingMaterials: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },

      // Persona fields
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      disposition: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      background: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      communicationStyle: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      emotionalState: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'coachoncue_scenarios',
      sequelize,
    }
  );
};

export { initCoachonCueScenario, CoachonCueScenario };
