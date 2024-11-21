import { Router } from "express";
import {loginUser, logoutUser, registerUser} from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser)

//secured route
router.route("/logout").post(varifyJwt,  logoutUser)


export default router;

