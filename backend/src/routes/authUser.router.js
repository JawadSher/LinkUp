import { Router } from "express";
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    refreshAccessToken, 
    updatePassword, 
    getCurrentUser, 
    updateAccount,
    updateAvatar,
    updateBannerImage
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
router.route("/refesh-access-token").post(refreshAccessToken);
router.route("/update-password").post(verifyJWT, updatePassword);
router.route("/update-account-details").patch(verifyJWT, updateAccount);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/update-bannerImage").patch(verifyJWT, upload.single('bannerImage'), updateBannerImage);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/ch/:").get(verifyJWT, getUserChannelProfile);
export default router;