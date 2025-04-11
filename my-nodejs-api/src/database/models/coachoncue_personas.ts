import { Model, DataTypes, Sequelize } from 'sequelize';

interface PersonaAttributes {
  id?: number;
  name: string;
  role: string;
  disposition: string;
  background: string;
  communicationStyle: string;
  emotionalState: string;
}

class CoachonCuePersona extends Model<PersonaAttributes> implements PersonaAttributes {
  public id!: number;
  public name!: string;
  public role!: string;
  public disposition!: string;
  public background!: string;
  public communicationStyle!: string;
  public emotionalState!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initCoachonCuePersona = (sequelize: Sequelize): void => {
  CoachonCuePersona.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
      tableName: 'coachoncue_personas',
      sequelize,
    }
  );
};

export { initCoachonCuePersona, CoachonCuePersona };
