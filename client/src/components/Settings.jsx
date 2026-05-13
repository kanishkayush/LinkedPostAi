import { PROFILE } from '../utils/constants';

export default function Settings({ auth, isConnected, onConnect, onDisconnect }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-linkedin-text">Settings</h2>

      {/* LinkedIn Connection */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-linkedin-blue rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-linkedin-text">LinkedIn Connection</h3>
            <p className="text-sm text-linkedin-text-secondary">Connect your account to publish posts</p>
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Connected</p>
                <p className="text-xs text-emerald-600">{auth?.name || 'LinkedIn User'}</p>
              </div>
            </div>
            <button onClick={onDisconnect} className="btn-ghost text-xs text-red-500 hover:text-red-600">
              Disconnect Account
            </button>
          </div>
        ) : (
          <button onClick={onConnect} className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            Connect LinkedIn
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="card p-6">
        <h3 className="font-semibold text-linkedin-text mb-3">Profile Context</h3>
        <p className="text-sm text-linkedin-text-secondary mb-3">
          This info is used by Claude AI to personalize your posts:
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex gap-2"><span className="text-linkedin-text-secondary w-20">Name:</span><span className="font-medium">{PROFILE.name}</span></div>
          <div className="flex gap-2"><span className="text-linkedin-text-secondary w-20">Role:</span><span className="font-medium">{PROFILE.role}</span></div>
          <div className="flex gap-2"><span className="text-linkedin-text-secondary w-20">Education:</span><span className="font-medium">{PROFILE.education}</span></div>
          <div className="flex gap-2"><span className="text-linkedin-text-secondary w-20">Goal:</span><span className="font-medium">SWE / Backend / ML Internship</span></div>
        </div>
      </div>

      {/* API Status */}
      <div className="card p-6">
        <h3 className="font-semibold text-linkedin-text mb-3">API Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-linkedin-bg rounded-lg">
            <span className="text-sm">Claude AI (Anthropic)</span>
            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">Backend configured</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-linkedin-bg rounded-lg">
            <span className="text-sm">LinkedIn API</span>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {isConnected ? 'Connected' : 'Not connected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
