import { Router } from "express";
import {
  getCurrentUser,
  updateAccount,
  updateAvatar,
  updateBannerImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/update-account-details").patch(verifyJWT, updateAccount);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);
router
  .route("/update-bannerImage")
  .patch(verifyJWT, upload.single("bannerImage"), updateBannerImage);
  
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/ch/:channelname").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);
export default router;
