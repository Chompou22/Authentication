import express from "express";
import { google, redirectGoogle } from "../controller/googleController";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  jwtStatus,
  login,
  logout,
  // sessionStatus,
  signup,
  updateUser,
} from "../controller/userController";
import { validateLogin, validateSignup } from "../validator/authValidation";

const router = express.Router();

// That route for local login
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
// router.get("/session", sessionStatus);
router.get("/jwt", jwtStatus);
router.get("/logout", logout);

// CRUD
router.get("/users", getAllUsers);
router.get("/user/:id", getSingleUser);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updateUser);

// That route to login with third-party authentication like google
router.get("/google", google);
router.get("/google/redirect", redirectGoogle);

export default router;
