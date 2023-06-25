import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  getMe,
  updateUserById,
  deleteUserById,
} from "../controllers/userController";

const router = Router();

// Get logged in user profile
router.get("/me", getMe);

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getAllUsers);

// Get a user by id
router.get("/:id", getUserById);

// Update a user by id
router.put("/:id", updateUserById);

// Delete a user by id
router.delete("/:id", deleteUserById);

export default router;
