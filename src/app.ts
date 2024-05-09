import SequelizeStoreImport from "connect-session-sequelize";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import sequelize from "./config/database";
import router from "./route/userRoute";
import "./strategy/googleStrategy"; // Ensure it's imported for middleware setup

dotenv.config();

interface EnvironmentVariables {
  SESSION_SECRET: string;
}

const processEnv: EnvironmentVariables = {
  SESSION_SECRET: process.env.SESSION_SECRET || "",
};

// Config our connection by using sequelize
const SequelizeStore = SequelizeStoreImport(session.Store);

// Middleware
const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true,
};

const app = express();

app.use(express.json()); // Using express.json() instead of bodyParser
app.use(cors(corsOptions));
app.set("trust proxy", 1);

const myStore = new SequelizeStore({
  db: sequelize,
});

// Session Configuration
app.use(
  session({
    secret: processEnv.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    store: myStore,
    proxy: true,
  })
);

// Initialize Passport Middleware AFTER configuring session
app.use(passport.initialize());
app.use(passport.session());

// Testing Route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to my authentication",
  });
});

// Routes
app.use("/api/v1", router);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
