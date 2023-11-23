import { Router } from "express";
import LikePost from "../controllers/like.post";
import validateJwtUser from "../../common/middlewares/auth.middleware";

export const likeRoutes = (): Router => {
  const router = Router();

  router.post("/likes/:postId", validateJwtUser.jwtUser, LikePost.createLike);

  return router;
};
