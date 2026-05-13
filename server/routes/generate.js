const express = require("express");
const { generatePost, refinePost, suggestHashtags, generateImagePrompt } = require("../utils/claude");

const router = express.Router();

/**
 * POST /api/generate
 * Generate a new LinkedIn post using Claude
 */
router.post("/generate", async (req, res) => {
  try {
    const { topic, project, tone, customInput } = req.body;

    if (!topic || !tone) {
      return res.status(400).json({ error: "Topic and tone are required" });
    }

    const postText = await generatePost({ topic, project, tone, customInput });
    res.json({ postText });
  } catch (error) {
    console.error("Generate error:", error.message);
    res.status(500).json({ error: "Failed to generate post. Check your API key." });
  }
});

/**
 * POST /api/refine
 * Refine an existing post with an action (shorter, punchier, cta, regenerate)
 */
router.post("/refine", async (req, res) => {
  try {
    const { postText, action } = req.body;

    if (!postText || !action) {
      return res.status(400).json({ error: "Post text and action are required" });
    }

    const refined = await refinePost({ postText, action });
    res.json({ postText: refined });
  } catch (error) {
    console.error("Refine error:", error.message);
    res.status(500).json({ error: "Failed to refine post." });
  }
});

/**
 * POST /api/hashtags
 * Suggest hashtags for a post
 */
router.post("/hashtags", async (req, res) => {
  try {
    const { postText } = req.body;

    if (!postText) {
      return res.status(400).json({ error: "Post text is required" });
    }

    const hashtags = await suggestHashtags({ postText });
    res.json({ hashtags });
  } catch (error) {
    console.error("Hashtags error:", error.message);
    res.status(500).json({ error: "Failed to suggest hashtags." });
  }
});

/**
 * POST /api/generate-image
 * Generate an image for a post using Pollinations.ai (free)
 */
router.post("/generate-image", async (req, res) => {
  try {
    const { postText } = req.body;

    if (!postText) {
      return res.status(400).json({ error: "Post text is required" });
    }

    // Use Groq to generate an optimized image prompt
    const imagePrompt = await generateImagePrompt({ postText });

    // Build Pollinations.ai URL (free, no API key needed)
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=627&nologo=true`;

    res.json({ imageUrl, imagePrompt });
  } catch (error) {
    console.error("Image generation error:", error.message);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

module.exports = router;
