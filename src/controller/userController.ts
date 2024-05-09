import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/userModel";
import Session from "../model/userSessionModel";

dotenv.config();

interface EnvironmentVariables {
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
}

const processEnv: EnvironmentVariables = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
};

interface SignUpRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

// Signup a user or create a user:

export const signup = async (req: SignUpRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      return res.json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.json({ status: true, message: "Record registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get all the users controller :
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get a single user by their id :
export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.json(user);
  } catch (error) {
    console.error("Error in getSingleUser:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Delete a single user by their id :

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.destroy({
      where: {
        id: id,
      },
    });
    res.json({ status: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Update a single user by their id and their new data info or new payload data :
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the password if provided
    let hashedPassword = user.password; // Default to current password if not provided
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login a single user :

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    // This line of code will tracking who is the user trying to access
    // req.session.user = user;

    if (!isMatch) {
      return res.json({ message: "Wrong password" });
    }
    const accessToken = jwt.sign(
      { email: user.email },
      processEnv.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { email: user.email },
      processEnv.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Save tokens and session ID to Session model
    await Session.create({
      accessToken: accessToken,
      refreshToken: refreshToken,
      sessionId: req.session.id, // Assuming req.session.id contains the session ID
      userId: user.id, // Associate the UserSession with the User by providing the user's ID
    });

    // Response
    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.json({ status: true, message: "Login successful" });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Route for testing a user authorization or not:

// Session route status testing and tracking who own the session :

// export const sessionStatus = (req: Request, res: Response) => {
//   console.log(req.session.id);
//   req.sessionStore.get(req.session.id, (err, session) => {
//     console.log(session);
//   });
//   return req.session.user
//     ? res.status(200).send(req.session.user)
//     : res.status(401).send({ msg: "Not authorized" });
// };

// Jwt token route status testing :
export const jwtStatus = (req: Request, res: Response) => {
  res.json({ status: true, message: "Authorized" });
};

// Logout and clear all the cookies properties session and jwt token :
export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("connect.sid");
  res.json({ status: true, message: "Logged out" });
};
