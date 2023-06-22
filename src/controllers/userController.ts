import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { name, email, username } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    res.status(409).json({ error: "User already exists" });
    return;
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
      },
    });
    res.json(newUser);
  } catch (error: any) {
    res
      .status(500)
      .json({
        status: "failed",
        message: "Failed to create new user",
        error: error.message,
      });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user by id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by id
export const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, image, bio, username } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        bio,
        image,
        username
      },
    });
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by id
export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.json(deletedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
