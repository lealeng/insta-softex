import { Router } from "express";
import authMiddleware from "../../common/middlewares/auth.middleware";
import CommentsPost from "../controllers/comments.post";
import commentsGet from "../controllers/comments.get";
import commentsPatch from "../controllers/comments.patch";
import commentsDelete from "../controllers/comments.delete";

export const commentsRoutes = (): Router => {
  const router = Router();

  router.post(
    "/posts/:postId/comments",
    authMiddleware.jwtUser,
    CommentsPost.createComment
  );
  router.get(
    "/posts/:postId/comments",
    authMiddleware.jwtUser,
    commentsGet.getComments
  );
  router.get("/comments/:id", authMiddleware.jwtUser, commentsGet.getCommentId);
  router.patch(
    "/posts/:postId/comments/:commentId",
    authMiddleware.jwtUser,
    commentsPatch.updateComment
  );
  router.delete(
    "/posts/:postId/comments/:commentId",
    authMiddleware.jwtUser,
    commentsDelete.deleteComment
  );

  return router;
};
