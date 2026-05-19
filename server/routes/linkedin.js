const express = require("express");
const { postToLinkedIn } = require("../utils/linkedin");

const router = express.Router();

/**
 * POST /api/post-to-linkedin
 * Publish a post to LinkedIn
 */
router.post("/post-to-linkedin", async (req, res) => {
  try {
    const { postText, accessToken, userId, imageUrl } = req.body;

    if (!postText || !accessToken || !userId) {
      return res.status(400).json({
        error: "Post text, access token, and user ID are required",
      });
    }

    const result = await postToLinkedIn(accessToken, userId, postText, imageUrl);
    res.json({ success: true, postId: result.id, data: result });
  } catch (error) {
    console.error(
      "LinkedIn post error:",
      error.response?.data || error.message
    );

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to post to LinkedIn";

    res.status(error.response?.status || 500).json({
      error: message,
      details: error.response?.data,
    });
  }
});

module.exports = router;
