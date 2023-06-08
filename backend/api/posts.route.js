import express from "express";
import PostsCtrl from "./posts.controller.js";

const router = express.Router();

router.route("/post/:id").get(PostsCtrl.apiGetPost);
router.route("/new").post(PostsCtrl.apiPostPost);
router.route("/:id")
    .put(PostsCtrl.apiUpdatePost)
    .delete(PostsCtrl.apiDeletePost);

export default router