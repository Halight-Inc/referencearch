import { Model, DataTypes, Sequelize } from 'sequelize';

interface ScenarioAttributes {
  id?: string;

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

  persona: {
    name: string;
    role: string;
    disposition: string;
    background: string;
    communicationStyle: string;
    emotionalState: string;
    avatar:string;
    avatarUrl:string;
  }
}

class Scenario extends Model<ScenarioAttributes> implements ScenarioAttributes {
  public id!: string;

  // Scenario fields
  public scenarioType!: string;
  public keyTopics!: string[];
  public competenciesAndGoals!: string[];
  public guidelines?: string[];
  public coachingFramework!: {
      name: string;
      description: string;
  };
  public supportingMaterials?: string[];

  public persona!: {
    name: string;
    role: string;
    disposition: string;
    background: string;
    communicationStyle: string;
    emotionalState: string;
    avatar:string;
    avatarUrl:string;
  }

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initScenario = (sequelize: Sequelize): void => {
  Scenario.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Generates a random UUID
        allowNull: false,
        unique: true,
        primaryKey: true,
            },

      // Scenario fields
      scenarioType: {
        type: DataTypes.STRING,
        allowNull: false
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
      persona: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      tableName: 'scenarios',
      sequelize,
    }
  );
};

export { initScenario, Scenario };
