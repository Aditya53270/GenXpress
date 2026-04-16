import userModel from "../models/userModel.js";
import ScheduledContent from "../models/scheduledContentModel.js";
import { enhancePrompt } from "../utils/promptEnhancer.js";
import { generateImageFromPrompt } from "../services/imageGenerationService.js";
import {
  generateTextContent,
  generateTemplateText,
} from "../services/textGenerationService.js";

export const enhanceUserPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.json({ success: false, message: "Prompt is required" });
    }

    const enhancedPrompt = enhancePrompt(prompt);
    return res.json({ success: true, enhancedPrompt });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt, usePromptEnhancer = false, enhancedPrompt } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user || !prompt) {
      return res.json({ success: false, message: "Missing details" });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "Insufficient credits",
        creditBalance: user.creditBalance,
      });
    }

    let finalPrompt = prompt;
    if (usePromptEnhancer) {
      finalPrompt = String(enhancedPrompt || "").trim();
      if (!finalPrompt) {
        return res.json({
          success: false,
          message: "Enhanced prompt missing. Please regenerate enhanced prompt and try again.",
        });
      }
    }

    const [imageUrl, textData] = await Promise.all([
      generateImageFromPrompt(finalPrompt),
      generateTextContent(finalPrompt),
    ]);

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    return res.json({
      success: true,
      imageUrl,
      title: textData.title,
      caption: textData.caption,
      hashtags: textData.hashtags,
      enhancedPrompt: finalPrompt,
      usedPrompt: finalPrompt,
      creditBalance: user.creditBalance - 1,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const scheduleContent = async (req, res) => {
  try {
    const { imageUrl, caption, hashtags, scheduledTime } = req.body;
    const userId = req.userId;

    if (!imageUrl || !caption || !scheduledTime) {
      return res.json({ success: false, message: "Missing scheduling details" });
    }

    const scheduled = await ScheduledContent.create({
      userId,
      imageUrl,
      caption,
      hashtags,
      scheduledTime,
      status: "pending",
    });

    return res.json({ success: true, scheduled });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getScheduledContent = async (req, res) => {
  try {
    const userId = req.userId;
    const schedules = await ScheduledContent.find({ userId }).sort({
      scheduledTime: 1,
    });

    return res.json({ success: true, schedules });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const generateTextDraft = async (req, res) => {
  try {
    const { type, topic, tone, recipient, keyPoints } = req.body;

    if (!type || !topic) {
      return res.json({ success: false, message: "Type and topic are required" });
    }

    const supportedTypes = ["email", "speech", "notice", "application"];
    if (!supportedTypes.includes(String(type).toLowerCase())) {
      return res.json({ success: false, message: "Unsupported text type" });
    }

    const draft = await generateTemplateText({
      type,
      topic,
      tone,
      recipient,
      keyPoints,
    });

    return res.json({ success: true, draft });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
