import express from "express";
import {
  getPostsBySearch,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js"; // as everyUser can see the posts, so we pass auth(middleware) to routes where a user should be loggedin to do that like(createPost, deletePost, updatePost, likePost)

const router = express.Router();

// since we are in the posts so each router starts with posts/.../

// when someone/user visits localhost 5000:
router.get("/search", getPostsBySearch); // we will call getPostsBySearch controller funtion on this search route
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);

// to implement update route
router.patch("/:id", auth, updatePost); // patch is used to update things existing documents
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost); // we also used patch for the like route coz liking is also like to be updating the likes post have
router.post("/:id/commentPost", auth, commentPost); // we also used patch for the like route coz liking is also like to be updating the likes post have

export default router;
