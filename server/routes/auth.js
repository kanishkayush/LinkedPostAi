const express = require("express");
const { exchangeCodeForToken, getUserProfile } = require("../utils/linkedin");

const router = express.Router();

/**
 * GET /auth/linkedin
 * Redirect user to LinkedIn OAuth consent screen
 */
router.get("/linkedin", (req, res) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI);
  const scope = encodeURIComponent("openid profile email w_member_social");
  const state = Math.random().toString(36).substring(7);

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

  res.redirect(authUrl);
});

/**
 * GET /auth/linkedin/callback
 * Exchange authorization code for access token, fetch profile, redirect to frontend
 */
router.get("/linkedin/callback", async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    console.error("LinkedIn OAuth error:", error, error_description);
    return res.redirect(
      `${process.env.FRONTEND_URL}?linkedin_error=${encodeURIComponent(error_description || error)}`
    );
  }

  if (!code) {
    return res.redirect(
      `${process.env.FRONTEND_URL}?linkedin_error=${encodeURIComponent("No authorization code received")}`
    );
  }

  try {
    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in;

    // Fetch user profile
    let profile = { id: "unknown", firstName: "User", lastName: "" };
    try {
      profile = await getUserProfile(accessToken);
    } catch (profileError) {
      console.warn("Could not fetch profile, using defaults:", profileError.message);
    }

    // Redirect to frontend with token info as URL params
    const params = new URLSearchParams({
      linkedin_token: accessToken,
      linkedin_user_id: profile.id,
      linkedin_name: `${profile.firstName} ${profile.lastName}`.trim(),
      linkedin_expires: expiresIn.toString(),
    });

    res.redirect(`${process.env.FRONTEND_URL}?${params.toString()}`);
  } catch (err) {
    console.error("Token exchange error:", err.response?.data || err.message);
    res.redirect(
      `${process.env.FRONTEND_URL}?linkedin_error=${encodeURIComponent("Failed to authenticate with LinkedIn")}`
    );
  }
});

module.exports = router;
