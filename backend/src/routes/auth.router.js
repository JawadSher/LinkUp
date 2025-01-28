import { Router } from "express";

import { registerUser } from "../controllers/authUser.controller";

const router = Router();

router.route("/login").get(registerUser);

export default router;