import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

interface EnvironmentVariables {
  username: string;
  password: string;
  database: string;
}

const sequelizeConfig: EnvironmentVariables = {
  username: process.env.DB_USER || "",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "",
};

const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

sequelize.sync();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
