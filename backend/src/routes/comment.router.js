import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/videos/:videoId/comments", getVideoComments);
router.post("/videos/:videoId/comments", verifyJWT, addComment);
router.patch("/videos/:videoId/comments/:commentId", verifyJWT, updateComment);
router.delete("/videos/:videoId/comments/:commentId", verifyJWT, deleteComment);

export default router;
