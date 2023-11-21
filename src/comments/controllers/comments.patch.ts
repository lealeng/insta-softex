import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";

class CommentsPatch {
  async updateComment(req: Request, res: Response) {
    const { postId, commentId } = req.params;
    try {
      const requestingUser = res.locals.user;

      const bodySchema = z.object({
        content: z.string(),
      });

      const { content } = bodySchema.parse(req.body);

      const post = await prisma.post.findUnique({
        where: { id: +postId },
      });
      if (!post) {
        return res.status(400).json({ message: "Post not found" });
      }

      const comment = await prisma.comments.findUnique({
        where: { id: +commentId },
      });
      if (!comment) {
        return res.status(400).json({ message: "Comment not found" });
      }

      if (comment.authorId !== requestingUser.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updatedComment = await prisma.comments.update({
        where: { id: +commentId },
        data: {
          content,
          authorId: requestingUser.id,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({ message: "Comment updated" });
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

export default new CommentsPatch();
