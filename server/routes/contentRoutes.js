import express from "express";
import userAuth from "../middlewares/auth.js";
import {
  enhanceUserPrompt,
  generateContent,
  scheduleContent,
  getScheduledContent,
  generateTextDraft,
} from "../controllers/contentController.js";

const contentRouter = express.Router();

contentRouter.post("/enhance-prompt", userAuth, enhanceUserPrompt);
contentRouter.post("/generate-content", userAuth, generateContent);
contentRouter.post("/schedule", userAuth, scheduleContent);
contentRouter.get("/schedule", userAuth, getScheduledContent);
contentRouter.post("/generate-text", userAuth, generateTextDraft);

export default contentRouter;
