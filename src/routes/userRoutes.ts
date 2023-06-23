import { Request, Response, Router } from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

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
