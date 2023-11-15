import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ZodError, z } from "zod";

class UserDelete {
  async deleteUser(req: Request, res: Response) {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const { id } = paramsSchema.parse(req.params);

      const existsUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existsUser) {
        return res.status(400).json({ message: "User not found" });
      }

      const deleteUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });

      if (!deleteUser) {
        return res.status(400).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted" });
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

export default new UserDelete();
