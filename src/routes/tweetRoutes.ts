import { Router, Request, Response } from 'express';

const router = Router();

// Create a new tweet
router.post("/", (req: Request, res: Response) => {});

// Get all tweets
router.get("/", (req: Request, res: Response) => {});

// Get a tweet by id
router.get("/:id", (req: Request, res: Response) => {});

// Update a tweet by id
router.put("/:id", (req: Request, res: Response) => {});

// Delete a tweet by id
router.delete("/:id", (req: Request, res: Response) => {});

export default router;