import { Router } from "express";
import postPost from "../controller/post.post";
import postGet from "../controller/post.get";
import validateJwtUser from "../../common/middlewares/auth.middleware";
import postPatch from "../controller/post.patch";

export const postRoutes = (): Router => {
  const router = Router();

  router.post("/posts", validateJwtUser.jwtUser, postPost.createPost);
  router.get("/posts", validateJwtUser.jwtUser, postGet.getPosts);
  router.get("/posts/:id", validateJwtUser.jwtUser, postGet.getPostId);
  router.patch("/posts/:id", validateJwtUser.jwtUser, postPatch.updatePost);

  return router;
};
