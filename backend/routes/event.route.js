import express from "express";
import multer from "multer";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  likeEvent,
  participateEvent,
} from "../controllers/event.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/createEvent", authenticate, upload.single("image"), createEvent);
router.get("/all", getAllEvents);
router.get("/get/:id", authenticate, getEventById);

router.post("/like/:eventId", authenticate, (req, res) => {
  req.io = req.app.get("io");
  likeEvent(req, res);
});

router.post("/participate/:eventId", authenticate, (req, res) => {
  req.io = req.app.get("io");
  participateEvent(req, res);
});

router.delete("/delete/:id", authenticate, deleteEvent);

export default router;
