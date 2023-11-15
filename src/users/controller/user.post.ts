import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";

class UserPost {
  async createUser(req: Request, res: Response) {
    try {
      const bodySchema = z.object({
        name: z.string().nonempty(),
        email: z.string().email(),
        password: z.string().min(6),
        bio: z.string().min(6),
        city: z.string(),
        country: z.string(),
      });
      const { name, email, password, bio, city, country } = bodySchema.parse(
        req.body
      );
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          bio,
          city,
          country,
        },
      });
      return res.status(201).json({ message: "User created" });
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

export default new UserPost();
