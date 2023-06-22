import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new user, if it doesn't already exist
// generate a JWT emailToken and send it back to the client
export const signup = async (req: Request, res: Response) => {
    const { email } = req.body;
}


// Verify the JWT emailToken and update the user's emailVerified field to true
// Generate a JWT accessToken and send it back to the client
export const verifyEmail = async (req: Request, res: Response) => {}
