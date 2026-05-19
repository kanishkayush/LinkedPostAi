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
 * Register an image upload with LinkedIn
 */
async function registerImageUpload(accessToken, userId) {
  const body = {
    registerUploadRequest: {
      recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
      owner: `urn:li:person:${userId}`,
      serviceRelationships: [
        {
          relationshipType: "OWNER",
          identifier: "urn:li:userGeneratedContent",
        },
      ],
    },
  };

  const response = await axios.post(
    "https://api.linkedin.com/v2/assets?action=registerUpload",
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const uploadUrl =
    response.data.value.uploadMechanism[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ].uploadUrl;
  const asset = response.data.value.asset;

  return { uploadUrl, asset };
}

/**
 * Upload image binary to LinkedIn
 */
async function uploadImageToLinkedIn(uploadUrl, accessToken, imageBuffer) {
  await axios.put(uploadUrl, imageBuffer, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "image/jpeg",
    },
  });
}

/**
 * Download image from URL and return as buffer
 */
async function downloadImage(imageUrl) {
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
    timeout: 30000,
  });
  return Buffer.from(response.data);
}

/**
 * Post content to LinkedIn (text only or with image)
 */
async function postToLinkedIn(accessToken, userId, postText, imageUrl) {
  // If there's an image URL, upload it to LinkedIn first
  let mediaAsset = null;
  if (imageUrl) {
    try {
      console.log("Downloading image from:", imageUrl);
      const imageBuffer = await downloadImage(imageUrl);

      console.log("Registering upload with LinkedIn...");
      const { uploadUrl, asset } = await registerImageUpload(accessToken, userId);

      console.log("Uploading image to LinkedIn...");
      await uploadImageToLinkedIn(uploadUrl, accessToken, imageBuffer);

      mediaAsset = asset;
      console.log("Image uploaded successfully:", asset);
    } catch (err) {
      console.error("Image upload failed, posting text only:", err.message);
      // Fall back to text-only post
    }
  }

  const body = {
    author: `urn:li:person:${userId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: postText },
        shareMediaCategory: mediaAsset ? "IMAGE" : "NONE",
        ...(mediaAsset && {
          media: [
            {
              status: "READY",
              media: mediaAsset,
            },
          ],
        }),
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
