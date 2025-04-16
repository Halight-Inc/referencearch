import { Model, DataTypes, Sequelize } from 'sequelize';

interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
}
interface SimulationAttributes {
  id?: string;

  // --- simulation fields ---
  status: string;
  interactionMode: string;
  scenarioId: string;
  userId: string;
  chatMessages: ChatMessage[]; // Optional chat messages, backend might default it
  simulationResult: {
    competencyEvaluations: {
      competency: string;
      rating: number;
      notes: string;
    }[],
    generalFeedback: string;
  }
}

class Simulation extends Model<SimulationAttributes> implements SimulationAttributes {
  public id!: string;

  public status!: string;
  public interactionMode!: string;
  public scenarioId!: string;
  public userId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public chatMessages!: ChatMessage[]; // Optional chat messages, backend might default it

  public simulationResult!: {
    competencyEvaluations: {
      competency: string;
      rating: number;
      notes: string;
    }[],
    generalFeedback: string;
  }
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
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // Scenario fields
      interactionMode: {
        type: DataTypes.STRING,
        allowNull: true
      },
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
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      simulationResult: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      chatMessages: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'simulations',
      sequelize,
    }
  );
};

export { initSimulation, Simulation, SimulationAttributes };
