import express from "express";
import { signin, signup } from "../controllers/user.js";

const router = express.Router();

// here signin/siginup form data will be posted in db and we can apply controller function as well i.e signin & signup
router.post("/signin", signin);
router.post("/signup", signup);

export default router;
