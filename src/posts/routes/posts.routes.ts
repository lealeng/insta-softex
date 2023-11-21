import { Router } from "express";
import postPost from "../controllers/post.post";
import postGet from "../controllers/post.get";
import validateJwtUser from "../../common/middlewares/auth.middleware";
import postPatch from "../controllers/post.patch";
import postDelete from "../controllers/post.delete";

export const postRoutes = (): Router => {
  const router = Router();

  router.post("/posts", validateJwtUser.jwtUser, postPost.createPost);
  router.get("/posts", validateJwtUser.jwtUser, postGet.getPosts);
  router.get("/posts/:id", validateJwtUser.jwtUser, postGet.getPostId);
  router.patch("/posts/:id", validateJwtUser.jwtUser, postPatch.updatePost);
  router.delete("/posts/:id", validateJwtUser.jwtUser, postDelete.deletePost);

  return router;
};
