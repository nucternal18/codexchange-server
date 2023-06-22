import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new tweet
export const createTweet = async (req: Request, res: Response) => {
  const { content, userId, image } = req.body;

  try {
    const newTweet = await prisma.tweet.create({
      data: {
        content,
        image,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.json(newTweet);
  } catch (error: any) {
    res
      .status(500)
      .json({
        status: "failed",
        message: "Failed to create tweet",
        error: error.message,
      });
  }
};

// Get all tweets
export const getAllTweets = async (req: Request, res: Response) => {
  try {
    const allTweets = await prisma.tweet.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });
    res.json(allTweets);
  } catch (error: any) {
    res
      .status(500)
      .json({
        status: "failed",
        message: "Failed to fetch tweets",
        error: error.message,
      });
  }
};

// Get a tweet by id
export const getTweetById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });
    res.json(tweet);
  } catch (error: any) {
    res
      .status(500)
      .json({
        status: "failed",
        message: "Failed to fetch tweet",
        error: error.message,
      });
  }
};

// Update a tweet by id
export const updateTweetById = async (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(501).json({ status: "failed", message: `Not implemented: ${id}` });
};

// Delete a tweet by id
export const deleteTweetById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTweet = await prisma.tweet.delete({
      where: {
        id: id,
      },
    });
    res.json({ message: "Tweet deleted successfully", status: "success" });
  } catch (error: any) {
    res
      .status(500)
      .json({
        status: "failed",
        message: "Failed to delete tweet",
        error: error.message,
      });
  }
};
