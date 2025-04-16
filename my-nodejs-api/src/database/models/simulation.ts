import { Model, DataTypes, Sequelize } from 'sequelize';

interface SimulationAttributes {
  id?: number;

  // --- simulation fields ---
  score: string;
  scenarioId: number;
  userId: number;
}

class Simulation extends Model<SimulationAttributes> implements SimulationAttributes {
  public id!: number;

  public score!: string;
  public scenarioId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initSimulation = (sequelize: Sequelize): void => {
  Simulation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Generates a random UUID
        allowNull: false,
        unique: true,
        primaryKey: true,
      },

      // Scenario fields
      score: {
        type: DataTypes.STRING,
        allowNull: false
      }
      ,
      scenarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'scenarios',
          key: 'id',
        },
      }
      ,
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'simulations',
      sequelize,
    }
  );
};

export { initSimulation, Simulation };
