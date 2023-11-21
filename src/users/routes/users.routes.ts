import { Router } from "express";
import UserGet from "../controllers/user.get";
import UserPost from "../controllers/user.post";
import UserPatch from "../controllers/user.patch";
import UserDelete from "../controllers/user.delete";
import authMiddleware from "../../common/middlewares/auth.middleware";
import userAuth from "../controllers/user.auth";

export const userRoutes = (): Router => {
  const router = Router();

  router.get("/users", authMiddleware.jwtUser, UserGet.getUsers);
  router.get("/users/:id", authMiddleware.jwtUser, UserGet.getUserId);
  router.post("/users", UserPost.createUser);
  router.patch("/users/:id", authMiddleware.jwtUser, UserPatch.updateUser);
  router.delete("/users/:id", authMiddleware.jwtUser, UserDelete.deleteUser);
  router.post("/users/login", userAuth.login);

  return router;
};
