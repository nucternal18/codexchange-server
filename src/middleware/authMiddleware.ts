import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../config/prismadb";
import dotenv from "dotenv";
import createError from "http-errors";

dotenv.config();

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    username: string | null;
    name: string | null;
    image: string | null;
  } | null;
}

function verifyAccessToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}

export async function protect(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization) {
    return next(
      new createError.Unauthorized(
        "No token provided. Access token is required"
      )
    );
  }

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(
        new createError.Unauthorized(
          "No token provided. Access token is required"
        )
      );
    }

    try {
      const decoded = await (<any>verifyAccessToken(token));

      if (!decoded)
        return next(
          new createError.Unauthorized("Invalid token. token expired")
        );

      const existingToken = await prisma.token.findUnique({
        where: {
          id: decoded.tokenId,
        },
        select: {
          userId: true,
          valid: true,
          expiresAt: true,
        },
      });

      // Check if token is valid or not expired
      if (!existingToken?.valid || existingToken?.expiresAt < new Date()) {
        return next(
          new createError.Unauthorized("Invalid token. token expired")
        );
      }

      req.user = await prisma.user.findUnique({
        where: {
          id: existingToken?.userId as string,
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          email: true,
        },
      });

      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new createError.Unauthorized(error?.message));
      }
      next(new createError.Unauthorized("Not Authorized"));
    }
  }
}
