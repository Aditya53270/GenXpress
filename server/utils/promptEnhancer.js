export const enhancePrompt = (prompt) => {
  const cleanPrompt = String(prompt || "").trim();
  if (!cleanPrompt) return "";

  const styleKeywords =
    "high-quality, cinematic composition, ultra realistic, detailed lighting, 4k";

  if (cleanPrompt.split(/\s+/).length <= 3) {
    return `A high-quality cinematic image of ${cleanPrompt} in a visually rich environment during golden hour, ultra realistic, 4k, detailed textures, dramatic lighting`;
  }

  return `${cleanPrompt}, ${styleKeywords}, storytelling context, professional color grading`;
};
