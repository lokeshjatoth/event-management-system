import express from "express";
import { login, logout, profile, signUp } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";


const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get('/profile', authenticate, profile);
router.post('/logout', authenticate, logout);

export default router;