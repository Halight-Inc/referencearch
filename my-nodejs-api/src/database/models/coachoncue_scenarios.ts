import { Model, DataTypes, Sequelize } from 'sequelize';

interface ScenarioAttributes {
  id?: number;
  scenarioType: string;
  keyTopics: string[];
  competenciesAndGoals: string[];
  guidelines: string[];
  coachingFramework: {
    name: string;
    description: string;
  };
  supportingMaterials?: string[];
  // personaId: number;
}

class CoachonCueScenario extends Model<ScenarioAttributes> implements ScenarioAttributes {
  public id!: number;
  public scenarioType!: string;
  public keyTopics!: string[];
  public competenciesAndGoals!: string[];
  public guidelines!: string[];
  public coachingFramework!: {
    name: string;
    description: string;
  };
  public supportingMaterials?: string[];
  // public personaId!: number;

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
      scenarioType: {
        type: DataTypes.STRING,
        allowNull: false,
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
      // personaId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'coachoncue_personas',
      //     key: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'RESTRICT',
      // },
    },
    {
      tableName: 'coachoncue_scenarios',
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ['scenarioType'],
        },
      ],
    }
  );
};

export { initCoachonCueScenario, CoachonCueScenario };
