import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserAuth {
  async login(req: Request, res: Response) {
    try {
      const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      });

      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token });
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

export default new UserAuth();
