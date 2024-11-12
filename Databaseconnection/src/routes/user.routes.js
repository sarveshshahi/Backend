import {Router} from "express"
import { regusterUser } from "../controllers/user.controllers.js"
const router=Router()

router.route("/register").post(regusterUser)

export default router 