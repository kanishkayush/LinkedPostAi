const axios = require("axios");

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(code) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
  });

  const response = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    params.toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return response.data;
}

/**
 * Get LinkedIn user profile
 */
async function getUserProfile(accessToken) {
  // Try the new OpenID userinfo endpoint first
  try {
    const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      id: response.data.sub,
      firstName: response.data.given_name || "User",
      lastName: response.data.family_name || "",
    };
  } catch (err) {
    // Fallback to legacy /v2/me endpoint
    const response = await axios.get("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      id: response.data.id,
      firstName: response.data.localizedFirstName,
      lastName: response.data.localizedLastName,
    };
  }
}

/**
 * Post content to LinkedIn using UGC Posts API v2
 */
async function postToLinkedIn(accessToken, userId, postText) {
  const body = {
    author: `urn:li:person:${userId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: postText },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const response = await axios.post(
    "https://api.linkedin.com/v2/ugcPosts",
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    }
  );

  return response.data;
}

module.exports = { exchangeCodeForToken, getUserProfile, postToLinkedIn };
