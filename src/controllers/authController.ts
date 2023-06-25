import createError from "http-errors";
import { Request, Response } from "express";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import prisma from "../config/prismadb";
import dotenv from "dotenv";
import { RequestWithUser } from "../middleware/authMiddleware";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_EXPIRATION_IN_MINUTES = 10;
const ACCESS_TOKEN_EXPIRATION_IN_HOURS = 12; // 7 days

const generateOneTimeCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateAccessToken = (tokenId: string) => {
  return jwt.sign({ tokenId }, process.env.JWT_SECRET!, {
    noTimestamp: true,
    algorithm: "HS256",
  });
};

// Create a new user, if it doesn't already exist
// generate a JWT emailToken and send it back to the client
export const login = async (req: Request, res: Response) => {
  const { email } = req.body;

  const oneTimeCode = generateOneTimeCode(); // Generate a random 6-digit code
  const expiration = new Date(
    new Date().getTime() + EMAIL_EXPIRATION_IN_MINUTES * 60 * 1000
  ); // Set the expiration time to 10 minutes from now

  try {
    // Create a new token
    const createdToken = await prisma.token.create({
      data: {
        oneTimeCode: oneTimeCode,
        user: {
          connectOrCreate: {
            where: { email: email },
            create: { email: email },
          },
        },
        type: "EMAIL",
        valid: true,
        expiresAt: expiration,
      },
    });

    // Send the email Token code to the user's email
    const sentEmail = await resend.sendEmail({
      from: "email@mail.aolausoro.tech",
      to: email as string,
      subject: "Email Verification",
      html: `<p>Your one-time code is <b>${oneTimeCode}</b></p>`,
    });

    // ...
    res
      .status(200)
      .json({ status: "success", message: "One-time code sent to the user." });
  } catch (error: any) {
    new createError.InternalServerError(error.message);
  }
};

// Verify the JWT emailToken and update the user's emailVerified field to true
// Generate a JWT accessToken and send it back to the client
export const authenticate = async (req: Request, res: Response) => {
  const { email, oneTimeCode } = req.body;

  try {
    // Find the token
    const token = await prisma.token.findUnique({
      where: {
        oneTimeCode: oneTimeCode,
      },
      include: {
        user: true,
      },
    });

    // Check if the token exists and is valid
    if (!token || !token.valid) {
      return res.status(400).json({
        status: "failed",
        message: "Unauthorized. Invalid one-time code.",
      });
    }

    // Check if the token has expired
    if (token.expiresAt < new Date()) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized. One-time code expired.",
      });
    }

    // Check if the user email in the token matches the email in the request body
    if (token.user.email !== email) {
      return res.sendStatus(401);
    }

    // Check if the user email is the same as the email in the request body

    // Generate API Token
    const expiration = new Date(
      new Date().getTime() + ACCESS_TOKEN_EXPIRATION_IN_HOURS * 60 * 60 * 1000
    );

    const apiToken = await prisma.token.create({
      data: {
        type: "API",
        expiresAt: expiration,
        user: {
          connect: {
            email: email,
          },
        },
      },
    });

    // Update the token to be invalid
    await prisma.token.update({
      where: { id: token.id },
      data: { valid: false },
    });

    // Update the user's emailVerified field to true
    await prisma.user.update({
      where: { email: email },
      data: { isVerified: true },
    });

    // Generate a JWT accessToken
    const accessToken = generateAccessToken(apiToken.id);

    //send accessToken to the client through a session cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "none",
      secure: true,
    });

    // Send the accessToken to the client
    res.status(200).json({
      status: "success",
      message: "User authenticated successfully.",
      accessToken: accessToken,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ status: "failed", message: "Failed to authenticate user." });
  }
};

// Logout a user by deleting the API token
export const logout = async (req: RequestWithUser, res: Response) => {
  try {
    req.user = null;
    req.headers.authorization = "";
    res.clearCookie("accessToken");
    res.status(204)
  } catch (error: any) {
    res
      .status(500)
      .json({ status: "failed", message: "Failed to logout user." });
  }
};
