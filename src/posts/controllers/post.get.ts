import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ZodError, z } from "zod";

class PostGet {
  async getPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { id: "asc" },
        where: { deletedAt: null },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              bio: true,
              city: true,
              country: true,
              Comments: true,
            },
          },
        },
      });
      return res.status(200).json({ posts });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", error: error.issues });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getPostId(req: Request, res: Response) {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const { id } = paramsSchema.parse(req.params);

      const post = await prisma.post.findUnique({
        where: { id: +id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              bio: true,
              city: true,
              country: true,
              Comments: true,
            },
          },
        },
      });

      if (!post) {
        return res.status(400).json({ message: "Post not found" });
      }

      return res.status(200).json({ post });
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

export default new PostGet();
