import { Request, Response } from "express";
import app from "./app";
import { prisma } from "./lib/prisma";

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World");
});

const start = async () => {
  try {
    await app.listen({ port: 3333 });
    console.log(" 👀 HTTP server running on http://localhost:3333");
  } catch (error) {
    console.log(error);
  }
};

start();
