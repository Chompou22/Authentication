import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

interface JWTDecodedPayload {
  email: string;
}

interface EnvironmentVariables {
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
}

const processEnv: EnvironmentVariables = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
};

export const renewToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken; // check refresh token
    let exist = false;

    if (!refreshToken) {
      res.status(401).json({ status: false, message: "No refreshToken" });
    } else {
      const decoded = (await jwt.verify(
        refreshToken,
        processEnv.REFRESH_TOKEN_SECRET
      )) as JWTDecodedPayload;
      if (decoded) {
        const accessToken = jwt.sign(
          { email: decoded.email },
          processEnv.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.cookie("accessToken", accessToken, {
          maxAge: 60 * 60 * 1000, // 1 hour
          httpOnly: true,
        });

        exist = true;
        res.status(200).json({ status: true, message: "Token renewed" });
      }
    }

    return exist;
  } catch (err) {
    res.status(401).json({ status: false, message: "Invalid token" });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("verifyUser middleware executed");
  try {
    const accessToken = req.cookies.accessToken; // check access token
    console.log("Access token:", accessToken);

    if (!accessToken) {
      const renewed = await renewToken(req, res, next);
      if (!renewed) {
        return res.status(401).json({
          status: false,
          message: "No accessToken or RenewToken",
        });
      }
      return res
        .status(401)
        .json({ status: false, message: "No accessToken or RenewToken" });
    }
    const decoded = await jwt.verify(
      accessToken,
      processEnv.ACCESS_TOKEN_SECRET
    );
    console.log("Decoded token data:", decoded);
    next();
  } catch (err) {
    res.status(401).json({ status: false, message: "Invalid token" });
  }
};
