import axios from "axios";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "for",
  "with",
  "to",
  "of",
  "in",
  "on",
  "at",
  "is",
  "are",
  "this",
  "that",
  "from",
  "into",
  "by",
  "my",
  "your",
  "our",
]);

const extractPromptKeywords = (prompt) => {
  const words = String(prompt || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word) && word.length > 2);

  return [...new Set(words)].slice(0, 8);
};

const toHashtag = (word) =>
  `#${word
    .replace(/[^a-z0-9]/gi, "")
    .replace(/^./, (ch) => ch.toUpperCase())}`;

const buildFallbackContent = (prompt) => {
  const cleanPrompt = String(prompt || "").trim();
  const keywords = extractPromptKeywords(cleanPrompt);
  const primary = keywords[0] || "creative concept";
  const secondary = keywords[1] || "visual storytelling";

  const title = `AI Visual: ${cleanPrompt.slice(0, 70)}`.trim();
  const caption = `A fresh AI concept focused on ${primary} with strong ${secondary} elements. Built from your prompt "${cleanPrompt}" for a high-impact social post with cinematic details and clear storytelling.`;
  const hashtags = [
    ...keywords.map(toHashtag),
    "#AICreator",
    "#ContentCreation",
    "#DigitalArt",
  ]
    .filter(Boolean)
    .slice(0, 10)
    .join(" ");

  return {
    title,
    caption,
    hashtags,
  };
};

export const generateTextContent = async (prompt) => {
  const provider = process.env.TEXT_PROVIDER || "fallback";
  const apiKey = process.env.OPENAI_API_KEY;

  if (provider !== "openai" || !apiKey) {
    return buildFallbackContent(prompt);
  }

  const requestBody = {
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a social media content strategist. Return strict JSON with keys: title, caption, hashtags.",
      },
      {
        role: "user",
        content: `Create a short title, a long engaging caption, and 5-10 relevant hashtags for: ${prompt}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  };

  const { data } = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  const raw = data?.choices?.[0]?.message?.content;
  const parsed = JSON.parse(raw || "{}");

  return {
    title: parsed.title || buildFallbackContent(prompt).title,
    caption: parsed.caption || buildFallbackContent(prompt).caption,
    hashtags: parsed.hashtags || buildFallbackContent(prompt).hashtags,
  };
};

const buildTemplateFallback = ({ type, topic, tone, recipient, keyPoints }) => {
  const cleanType = String(type || "email").toLowerCase();
  const cleanTopic = String(topic || "").trim();
  const cleanTone = String(tone || "professional").trim();
  const cleanRecipient = String(recipient || "Sir/Madam").trim();
  const points = String(keyPoints || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bulletSection = points.length
    ? points.map((point) => `- ${point}`).join("\n")
    : "- Add your first key point here\n- Add your second key point here";

  if (cleanType === "speech") {
    return `Good morning ${cleanRecipient},\n\nToday I want to speak about ${cleanTopic}. This topic matters because it affects our daily growth and future.\n\n${bulletSection}\n\nLet us take practical steps and work together with a ${cleanTone} mindset. Thank you.`;
  }

  if (cleanType === "notice") {
    return `NOTICE\n\nDate: ${new Date().toLocaleDateString()}\nSubject: ${cleanTopic}\n\nThis is to inform ${cleanRecipient} that the following points are important:\n${bulletSection}\n\nPlease take note and act accordingly.\n\nBy Order,\nGenXpress Administration`;
  }

  if (cleanType === "application") {
    return `To,\n${cleanRecipient}\n\nSubject: Application regarding ${cleanTopic}\n\nRespected Sir/Madam,\n\nI am writing this application regarding ${cleanTopic}. I request you to kindly consider the following:\n${bulletSection}\n\nI shall be grateful for your support.\n\nYours sincerely,\n[Your Name]`;
  }

  return `Subject: ${cleanTopic}\n\nDear ${cleanRecipient},\n\nI hope you are doing well. I am writing regarding ${cleanTopic}. Please find the key points below:\n${bulletSection}\n\nLet me know if you need any clarification.\n\nRegards,\n[Your Name]`;
};

export const generateTemplateText = async (payload) => {
  const provider = process.env.TEXT_PROVIDER || "fallback";
  const apiKey = process.env.OPENAI_API_KEY;

  if (provider !== "openai" || !apiKey) {
    return buildTemplateFallback(payload);
  }

  const { type, topic, tone, recipient, keyPoints } = payload;

  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert writing assistant. Generate polished content exactly for requested format only.",
          },
          {
            role: "user",
            content: `Write a ${type} on topic: "${topic}". Tone: ${tone}. Recipient/Audience: ${recipient}. Key points:\n${keyPoints}\n\nReturn only final draft text.`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data?.choices?.[0]?.message?.content?.trim() || buildTemplateFallback(payload);
  } catch (error) {
    return buildTemplateFallback(payload);
  }
};
