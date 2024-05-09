import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface SessionAttributes {
  sid: string;
  expires?: Date;
  data: string;
}

class Session extends Model<SessionAttributes> implements SessionAttributes {
  public sid!: string;
  public expires?: Date;
  public data!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Session.init(
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: {
      type: DataTypes.DATE,
    },
    data: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Session",
  }
);

export default Session;
