import { Router } from "express";
import UserGet from "../controller/user.get";
import UserPost from "../controller/user.post";
import UserPatch from "../controller/user.patch";
import UserDelete from "../controller/user.delete";
import authMiddleware from "../../common/middlewares/auth.middleware";
import userAuth from "../controller/user.auth";

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
