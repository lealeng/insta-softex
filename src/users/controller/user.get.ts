import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ZodError, z } from "zod";

class UserGet {
  async getUsers(req: Request, res: Response) {
    try {
      const user = await prisma.user.findMany({
        orderBy: { id: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          city: true,
          country: true,
          Post: true,
        },
      });

      return res.status(200).json({ user });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", error: error.issues });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const { id } = paramsSchema.parse(req.params);

      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          city: true,
          country: true,
          Post: true,
        },
      });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
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

export default new UserGet();
