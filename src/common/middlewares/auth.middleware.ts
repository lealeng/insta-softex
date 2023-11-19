import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

class validateJwtUser {
  async jwtUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const jwtPayload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as {
        id: number;
        email: string;
      };

      const { id } = jwtPayload;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      res.locals.user = user;

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ message: "Not possible to authenticate" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new validateJwtUser();
