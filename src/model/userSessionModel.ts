import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface UserSessionAttributes {
  id: number;
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  userId: number;
}

interface UserCreateSessionAttributes
  extends Optional<UserSessionAttributes, "id"> {}

class UserSession
  extends Model<UserSessionAttributes, UserCreateSessionAttributes>
  implements UserSessionAttributes
{
  public id!: number;
  public accessToken!: string;
  public refreshToken!: string;
  public sessionId!: string;
  public userId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER, // Assuming userId is of type integer
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserSession",
  }
);

export default UserSession;
