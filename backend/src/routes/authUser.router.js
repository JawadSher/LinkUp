import { Router } from "express";
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    refreshAccessToken, 
    updatePassword, 

} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1,
    },
    {
        name: 'bannerImage',
        maxCount: 1
    }
]), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-access-token").get(refreshAccessToken);
router.route("/update-password").post(verifyJWT, updatePassword);

export default router;