import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ZodError, z } from "zod";
import { User } from "@prisma/client";

class PostPost {
  async createPost(req: Request, res: Response) {
    try {
      const requestingUser = res.locals.user as User;

      const bodySchema = z.object({
        imageUrl: z.string().url(),
        label: z.string(),
      });
      const { imageUrl, label } = bodySchema.parse(req.body);
      const post = await prisma.post.create({
        data: {
          imageUrl,
          label,
          authorId: requestingUser.id,
        },
      });
      return res.status(201).json({ message: "Post created", post });
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

export default new PostPost();
