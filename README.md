# LinkedIn AI Agent 🤖

AI-powered LinkedIn post generator that creates personalized, engaging posts using Claude AI and publishes them directly to LinkedIn.

## Features

- ✨ **AI Post Generation** — Claude AI generates LinkedIn posts personalized to your developer profile
- 🎨 **Topic & Tone Control** — Choose from Project Showcase, Dev Tips, Learning in Public, and more
- ✏️ **Smart Editing** — AI-powered refinement: make posts shorter, punchier, or add CTAs
- 🔗 **LinkedIn Integration** — OAuth 2.0 login and direct posting via LinkedIn API
- 📋 **Post History** — Local storage of all generated and posted content
- #️⃣ **Hashtag Suggestions** — AI-generated relevant hashtags
- 📱 **Responsive Design** — Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS + Vite |
| Backend | Node.js + Express.js |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| LinkedIn | LinkedIn API v2 (OAuth 2.0) |
| Storage | localStorage |

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- LinkedIn Developer App ([create one here](https://developer.linkedin.com))
- Anthropic API key ([get one here](https://console.anthropic.com))

### 2. LinkedIn Developer App Setup
1. Go to https://developer.linkedin.com
2. Create a new app
3. Add OAuth 2.0 redirect URL: `http://localhost:3001/auth/linkedin/callback`
4. Request scopes: `w_member_social`, `r_liteprofile`, `r_emailaddress`
5. Copy your Client ID and Client Secret

### 3. Environment Variables
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key
LINKEDIN_CLIENT_ID=your_linkedin_app_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_app_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3001/auth/linkedin/callback
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 4. Install & Run

**Backend:**
```bash
cd server
npm install
node server.js
```

**Frontend (new terminal):**
```bash
cd client
npm install
npm run dev
```

### 5. Use the App
1. Open http://localhost:5173
2. Click Settings → Connect LinkedIn → Authorize
3. Go to Generator tab
4. Select topic, project, and tone
5. Click "Generate Post"
6. Edit, refine, and post!

## Project Structure

```
linkedin/
├── client/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # API calls, constants
│   │   ├── App.jsx          # Main app
│   │   └── index.css        # Tailwind + custom styles
│   └── vite.config.js       # Vite config with API proxy
│
├── server/                  # Node.js + Express
│   ├── routes/              # API endpoints
│   ├── utils/               # Claude & LinkedIn helpers
│   ├── server.js            # Express entry point
│   └── .env.example         # Environment template
│
└── README.md
```

## License
MIT
