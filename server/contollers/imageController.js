import userModel from "../models/userModel.js";
import { generateImageFromPrompt } from "../services/imageGenerationService.js";

const generateImage = async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!user || !prompt) {
      return res.json({ success: false, message: "missing details or check the prompt" });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "check credit balance ",
        creditBalance: user.creditBalance,
      });
    }

    const resultImage = await generateImageFromPrompt(prompt);

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "image is ready",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { generateImage };