import express from "express";
import { userRoutes } from "./users/routes/users.routes";
import { postRoutes } from "./posts/routes/posts.routes";

const app = express();

app.use(express.json());

app.use(userRoutes());
app.use(postRoutes());

export default app;
