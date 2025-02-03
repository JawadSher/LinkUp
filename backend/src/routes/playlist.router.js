import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createPlaylist, 
    getPlaylist, 
    getUserPlaylists 
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist);
router.route("/show-all-playlists/:userId").get(verifyJWT, getUserPlaylists);
router.route("/:playlistId").get(verifyJWT, getPlaylist);

export default router;