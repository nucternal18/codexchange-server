import { Request, Response, Router } from 'express';

const router = Router();

// Create a new user
router.post("/", (req: Request, res: Response) => {});

// Get all users
router.get("/", (req: Request, res: Response) => {});

// Get a user by id
router.get("/:id", (req: Request, res: Response) => {});

// Update a user by id
router.put("/:id", (req: Request, res: Response) => {});

// Delete a user by id
router.delete("/:id", (req: Request, res: Response) => {});


export default router;