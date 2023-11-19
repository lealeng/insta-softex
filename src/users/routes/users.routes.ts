import { Router } from "express";
import UserGet from "../controller/user.get";
import UserPost from "../controller/user.post";
import UserPatch from "../controller/user.patch";
import UserDelete from "../controller/user.delete";

export const userRoutes = (): Router => {
  const router = Router();

  router.get("/users", UserGet.getUsers);
  router.get("/users/:id", UserGet.getUserId);
  router.post("/users", UserPost.createUser);
  router.patch("/users/:id", UserPatch.updateUser);
  router.delete("/users/:id", UserDelete.deleteUser);

  return router;
};
