import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { User } from "@prisma/client";

class CommentsPost {
  async createComment(req: Request, res: Response) {
    const { postId } = req.params;
    try {
      const requestingUser = res.locals.user as User;

      const bodySchema = z.object({
        content: z.string().min(1).max(100),
      });

      const { content } = bodySchema.parse(req.body);

      const post = await prisma.post.findUnique({
        where: { id: +postId },
      });

      if (!post) {
        return res.status(400).json({ message: "Post not found" });
      }

      const comment = await prisma.comments.create({
        data: {
          postId: +postId,
          authorId: requestingUser.id,
          content,
        },
      });
      return res.status(201).json({ message: "Comment created" });
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

export default new CommentsPost();
