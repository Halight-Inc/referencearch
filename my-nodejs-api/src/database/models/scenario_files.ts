import { Model, DataTypes, Sequelize } from 'sequelize';

interface ScenarioFileInterface {
  id?: string;
  scenarioId: string;
  path: string | null; // s3 path
  base64: string | null;
}

class ScenarioFile extends Model<ScenarioFileInterface> implements ScenarioFileInterface {
  public id!: string;

  public scenarioId!: string;
  public path!: string; // s3 path
  public base64!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initScenarioFile = (sequelize: Sequelize): void => {
  ScenarioFile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Generates a random UUID
        allowNull: false,
        primaryKey: true
      },
      scenarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'scenarios',
          key: 'id',
        },
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      base64: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'scenario_files',
      sequelize,
    }
  );
};

export { initScenarioFile, ScenarioFile };
