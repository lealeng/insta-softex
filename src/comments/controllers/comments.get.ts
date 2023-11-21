import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";

class CommentsGet {
  async getComments(req: Request, res: Response) {
    const { postId } = req.params;
    try {
      const comments = await prisma.comments.findMany({
        orderBy: { id: "asc" },
        where: { postId: +postId, deletedAt: null },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              bio: true,
              city: true,
              country: true,
            },
          },
        },
      });

      return res.status(200).json({ comments });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", error: error.issues });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCommentId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const comment = await prisma.comments.findUnique({
        where: { id: +id, deletedAt: null },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              bio: true,
              city: true,
              country: true,
            },
          },
        },
      });
      if (!comment) {
        return res.status(400).json({ message: "Comment not found" });
      }
      return res.status(200).json({ comment });
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

export default new CommentsGet();
