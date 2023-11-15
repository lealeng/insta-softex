import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";

class UserPut {
  async updateUser(req: Request, res: Response) {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const { id } = paramsSchema.parse(req.params);

      const bodySchema = z.object({
        name: z.string().nonempty().optional(),
        password: z.string().min(6).optional(),
        bio: z.string().min(6).optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        updatedAt: z.date().optional(),
      });

      const { name, password, bio, city, country, updatedAt } =
        bodySchema.parse(req.body);

      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updateUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          name,
          password: hashedPassword,
          bio,
          city,
          country,
          updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
        },
      });

      if (!updateUser) {
        return res.status(400).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User updated" });
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

export default new UserPut();
