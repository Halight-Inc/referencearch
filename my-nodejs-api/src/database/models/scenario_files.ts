import { Model, DataTypes, Sequelize } from 'sequelize';

interface ScenarioFileInterface {
  id?: number;
  scenarioId: number;
  path: string | null; // s3 path
  base64: string;
}

class ScenarioFile extends Model<ScenarioFileInterface> implements ScenarioFileInterface {
  public id!: number;

  public scenarioId!: number;
  public path!: string; // s3 path
  public base64!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initScenarioFile = (sequelize: Sequelize): void => {
  ScenarioFile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      scenarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'coachoncue_scenarios',
          key: 'id',
        },
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      base64: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'scenario_files',
      sequelize,
    }
  );
};

export { initScenarioFile, ScenarioFile };
