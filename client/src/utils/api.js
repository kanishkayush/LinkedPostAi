const API_BASE = '';

export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export async function generatePost({ topic, project, tone, customInput }) {
  return apiCall('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ topic, project, tone, customInput }),
  });
}

export async function refinePost({ postText, action }) {
  return apiCall('/api/refine', {
    method: 'POST',
    body: JSON.stringify({ postText, action }),
  });
}

export async function suggestHashtags({ postText }) {
  return apiCall('/api/hashtags', {
    method: 'POST',
    body: JSON.stringify({ postText }),
  });
}

export async function postToLinkedIn({ postText, accessToken, userId }) {
  return apiCall('/api/post-to-linkedin', {
    method: 'POST',
    body: JSON.stringify({ postText, accessToken, userId }),
  });
}

export async function generateImage({ postText }) {
  return apiCall('/api/generate-image', {
    method: 'POST',
    body: JSON.stringify({ postText }),
  });
}
