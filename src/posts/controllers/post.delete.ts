import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ZodError, z } from "zod";

class PostDelete {
  async deletePost(req: Request, res: Response) {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const { id } = paramsSchema.parse(req.params);

      const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
      });

      if (!post) {
        return res.status(400).json({ message: "Post not found" });
      }

      const deletedPost = await prisma.post.update({
        where: { id: parseInt(id) },
        data: {
          deletedAt: new Date(),
        },
      });

      return res.status(200).json({ message: "Post deleted", deletedPost });
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

export default new PostDelete();
