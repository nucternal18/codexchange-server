import { Router, Request, Response } from 'express';

import { createTweet, getAllTweets, getTweetById, updateTweetById, deleteTweetById } from '../controllers/tweetController';

const router = Router();

// Create a new tweet
router.post("/", createTweet);

// Get all tweets
router.get("/", getAllTweets);

// Get a tweet by id
router.get("/:id", getTweetById);

// Update a tweet by id
router.put("/:id", updateTweetById);

// Delete a tweet by id
router.delete("/:id", deleteTweetById);

export default router;