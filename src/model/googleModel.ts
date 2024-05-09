import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface GoogleUserAttributes {
  id: number;
  username: string;
  googleId: string;
}

interface GoogleCreateUserAttributes
  extends Optional<GoogleUserAttributes, "id"> {}

class GoogleUser
  extends Model<GoogleUserAttributes, GoogleCreateUserAttributes>
  implements GoogleUserAttributes
{
  public id!: number;
  public username!: string;
  public googleId!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GoogleUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "GoogleUser",
  }
);

export default GoogleUser;
