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

router.route("/create-playlist").post(verifyJWT, createPlaylist);
router.route("/show-all-playlists/:userId").get(verifyJWT, getUserPlaylists);
router.route("/:playlistId").get(verifyJWT, getPlaylist);
router.route("/add/:playlistId/:videoId").patch(verifyJWT, addVideoToPlaylist);
router.route("/rm/:playlistId/:videoId").patch(verifyJWT, removeVideoFromPlaylist);
router.route("/del/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/up/:playlistId").patch(verifyJWT, updatePlaylist);

export default router;