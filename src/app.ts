import express from "express";
import { userRoutes } from "./users/routes/users.routes";
import { postRoutes } from "./posts/routes/posts.routes";
import { commentsRoutes } from "./comments/routes/comments.routes";
import { likeRoutes } from "./likes/routes/likes.routes";

const app = express();

app.use(express.json());

app.use(userRoutes());
app.use(postRoutes());
app.use(commentsRoutes());
app.use(likeRoutes());

export default app;
