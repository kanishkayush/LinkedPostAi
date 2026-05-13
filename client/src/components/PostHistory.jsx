import { useState } from 'react';

export default function PostHistory({ history, onDelete, onClear, onUsePost }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-4">
      {/* Best Time Banner */}
      <div className="bg-gradient-to-r from-linkedin-blue/10 to-blue-50 rounded-xl p-4 border border-linkedin-blue/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🕐</span>
          <span className="text-sm font-bold text-linkedin-text">Best times to post</span>
        </div>
        <p className="text-sm text-linkedin-text-secondary">
          <strong className="text-linkedin-blue">Tue–Thu, 8–9 AM IST</strong> — highest engagement for developer content
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-linkedin-text">
          Post History <span className="text-linkedin-text-secondary font-normal text-sm">({history.length})</span>
        </h2>
        {history.length > 0 && (
          <button onClick={onClear} className="text-xs text-red-500 hover:underline font-medium">
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-5xl block mb-3">📝</span>
          <p className="text-linkedin-text-secondary">No posts yet. Generate your first post!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((post) => (
            <div key={post.id} className="card p-4 animate-slide-up">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${post.status === 'posted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'}`}>
                      {post.status === 'posted' ? '✓ Posted' : '◐ Draft'}
                    </span>
                    {post.topic && (
                      <span className="text-xs text-linkedin-text-secondary">{post.topic}</span>
                    )}
                  </div>

                  <p className="text-sm text-linkedin-text line-clamp-2 cursor-pointer hover:text-linkedin-blue"
                     onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}>
                    {post.content.substring(0, 120)}{post.content.length > 120 ? '...' : ''}
                  </p>

                  {expandedId === post.id && (
                    <div className="mt-3 p-3 bg-linkedin-bg rounded-lg text-sm whitespace-pre-wrap animate-fade-in">
                      {post.content}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-2 text-xs text-linkedin-text-secondary">
                    <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                    {post.postedAt && <span>Posted: {new Date(post.postedAt).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => onUsePost(post.content)}
                    className="btn-ghost text-xs px-2 py-1" title="Use this post">
                    ✏️
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(post.content); }}
                    className="btn-ghost text-xs px-2 py-1" title="Copy">
                    📋
                  </button>
                  <button onClick={() => onDelete(post.id)}
                    className="btn-ghost text-xs px-2 py-1 text-red-400 hover:text-red-600" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
