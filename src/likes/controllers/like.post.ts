import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ZodError, z } from "zod";
import { User } from "@prisma/client";

class LikePost {
  async createLike(req: Request, res: Response) {
    try {
      const requestingUser = res.locals.user as User;

      const { postId } = req.params;

      const validationLike = await prisma.likes.findFirst({
        where: {
          postId: +postId,
          authorId: requestingUser.id,
        },
      });
      if (validationLike) {
        if (validationLike.liked) {
          validationLike.liked = false;
          await prisma.likes.create({
            data: validationLike,
          });
          return res.status(201).json({ message: "Like removed" });
        } else {
          validationLike.liked = true;
          await prisma.likes.create({
            data: validationLike,
          });
          return res.status(201).json({ message: "Like added" });
        }
      }

      const like = await prisma.likes.create({
        data: {
          postId: +postId,
          authorId: requestingUser.id,
          liked: true,
        },
      });
      return res.status(201).json({ message: "You liked the post" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", error: error.issues });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new LikePost();
