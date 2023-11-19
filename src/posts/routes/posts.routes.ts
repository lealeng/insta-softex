import { Router } from "express";
import postPost from "../controller/post.post";
import validateJwtUser from "../../common/middlewares/auth.middleware";

export const postRoutes = (): Router => {
  const router = Router();

  router.post("/posts", validateJwtUser.jwtUser, postPost.createPost);

  return router;
};
