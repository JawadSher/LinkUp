import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  deleteVideo,
  getAllVideos,
  getOwnerChannelVideos,
  getSpecificChannelVideos,
  getVideoById,
  getVideosBySearch,
  incrementVideoView,
  publishVideo,
  toggleisPublicStatus,
  updateVideoDetails,
} from "../controllers/video.controller";

const router = Router();

router.route("/upload").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);

router.route("/").get(getAllVideos);
router.route("/channel-videos").get(verifyJWT, getOwnerChannelVideos);
router.route("/channel").get(getSpecificChannelVideos);
router.route("/search").get(getVideosBySearch);
router.route("/v/:videoId").get(getVideoById);
router.route("/inc-views/v/:videoId").patch(incrementVideoView);
router.route("/v/update-details/:videoId").patch(verifyJWT, updateVideoDetails);
router.route("/v/del").delete(verifyJWT, deleteVideo);
router.route("/v/tog-status/").patch(verifyJWT, toggleisPublicStatus);

export default router;
