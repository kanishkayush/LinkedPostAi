const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a LinkedIn ghostwriter for Kanishk, a Full Stack Developer and AI/ML undergrad at Manipal University Jaipur.

His profile:
- Skills: React.js, Node.js, FastAPI, Python, TypeScript, Firebase, Scikit-learn, NLP
- Projects: CivicPulse (civic tech, React+Firebase), QuantumVerse (3D quantum visualizer, React), Emmarizer (NLP email summarizer, Python+FastAPI+Twilio)
- Certifications: Cisco, Red Hat, NPTEL (ML, DSA, Deep Learning), Apna College (MERN, DSA)
- Goal: SWE / backend / ML internship
- CGPA: 7.75, MUJ 2023-2027

Rules for every post you write:
- Sound like a real developer, not a corporate marketer
- NEVER use "Excited to share", "Thrilled to announce", "Humbled"
- Use line breaks for scannability
- Use → bullet style or numbered lists where relevant
- Include 3-5 hashtags at the very end
- End with a genuine question or CTA to boost engagement
- Length: 150-250 words
- Tone must match what is specified by the user
- Return ONLY the post text, no explanations or prefixes`;

/**
 * Generate a LinkedIn post using Groq (Llama 3)
 */
async function generatePost({ topic, project, tone, customInput }) {
  const userPrompt = `Write a LinkedIn post about: ${topic}
Project to highlight: ${project || "None/General"}
Tone: ${tone}
${customInput ? `Additional context: ${customInput}` : ""}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 1024,
    temperature: 0.8,
  });

  return completion.choices[0].message.content;
}

/**
 * Refine an existing post with a specific action
 */
async function refinePost({ postText, action }) {
  const actionPrompts = {
    shorter:
      "Make this LinkedIn post shorter and more concise. Keep the core message but cut it down to under 150 words. Return ONLY the revised post, no explanations.",
    punchier:
      "Make this LinkedIn post punchier and more impactful. Use stronger verbs, shorter sentences, and more energy. Return ONLY the revised post, no explanations.",
    cta: "Add a compelling call-to-action at the end of this LinkedIn post. Make it feel natural, not forced. Return ONLY the revised post, no explanations.",
    regenerate:
      "Rewrite this LinkedIn post from scratch with a completely different angle and structure, but keep the same topic and key information. Return ONLY the revised post, no explanations.",
  };

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `${actionPrompts[action] || actionPrompts.regenerate}\n\nOriginal post:\n${postText}`,
      },
    ],
    max_tokens: 1024,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

/**
 * Generate hashtag suggestions for a post
 */
async function suggestHashtags({ postText }) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Suggest exactly 5 relevant LinkedIn hashtags for this post. Return ONLY the hashtags separated by spaces, nothing else. Example format: #WebDev #React #AI #Coding #Tech\n\nPost:\n${postText}`,
      },
    ],
    max_tokens: 100,
    temperature: 0.5,
  });

  return completion.choices[0].message.content
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.startsWith("#"));
}

/**
 * Generate an image prompt from post content using Groq
 */
async function generateImagePrompt({ postText }) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Based on this LinkedIn post, generate a short image prompt (max 15 words) for an AI image generator. The image should be professional, modern, and suitable for a LinkedIn post. Focus on the core concept/technology mentioned. Return ONLY the image prompt, nothing else.

Post:
${postText}`,
      },
    ],
    max_tokens: 60,
    temperature: 0.7,
  });

  return completion.choices[0].message.content.trim().replace(/"/g, "");
}

module.exports = { generatePost, refinePost, suggestHashtags, generateImagePrompt };
