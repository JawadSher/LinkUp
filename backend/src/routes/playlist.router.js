import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getPlaylist,
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createPlaylist);

router.route("/user/:userId").get(verifyJWT, getUserPlaylists);

router
  .route("/:playlistId")
  .get(verifyJWT, getPlaylist)
  .patch(verifyJWT, updatePlaylist)
  .delete(verifyJWT, deletePlaylist);

router
  .route("/:playlistId/videos/:videoId")
  .post(verifyJWT, addVideoToPlaylist)
  .delete(verifyJWT, removeVideoFromPlaylist);

export default router;
