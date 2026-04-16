import axios from "axios";
import FormData from "form-data";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const toSafePrompt = (prompt) => encodeURIComponent(String(prompt || "").trim());

const generateWithFallbackProvider = async (prompt) => {
  // Free/public fallback to keep UX working if primary provider is rate-limited.
  const url = `https://image.pollinations.ai/prompt/${toSafePrompt(prompt)}?width=1024&height=1024&nologo=true`;
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  const base64Image = Buffer.from(data, "binary").toString("base64");
  return `data:image/png;base64,${base64Image}`;
};

export const generateImageFromPrompt = async (prompt) => {
  const apiKey = process.env.CLIPDROP_API;
  if (!apiKey) {
    throw new Error("CLIPDROP_API is missing in server .env");
  }

  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      const { data } = await axios.post(
        "https://clipdrop-api.co/text-to-image/v1",
        formData,
        {
          headers: {
            "x-api-key": apiKey,
            ...formData.getHeaders(),
          },
          responseType: "arraybuffer",
        }
      );

      const base64Image = Buffer.from(data, "binary").toString("base64");
      return `data:image/png;base64,${base64Image}`;
    } catch (error) {
      lastError = error;
      if (error?.response?.status === 429 && attempt < 2) {
        await sleep(1200);
        continue;
      }
      continue;
    }
  }

  if (lastError?.response?.status === 429) {
    try {
      return await generateWithFallbackProvider(prompt);
    } catch (fallbackError) {
      throw new Error(
        "Clipdrop rate-limited (429) and fallback provider failed. Please retry in a minute."
      );
    }
  }

  throw new Error(lastError?.message || "Clipdrop image generation failed");
};
