import { useState } from 'react';
import { PROFILE } from '../utils/constants';

export default function PostPreview({ postText, isEditing, onEdit, onTextChange, imageUrl, onRemoveImage, onImageError }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="linkedin-post-card animate-slide-up">
      {/* Post Header */}
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-linkedin-blue to-linkedin-blue-dark 
                          flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-bold text-sm">{PROFILE.initials}</span>
          </div>
          
          {/* Name & Role */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-linkedin-text text-[15px] leading-tight">
              {PROFILE.name}
            </h3>
            <p className="text-xs text-linkedin-text-secondary leading-tight mt-0.5">
              {PROFILE.role}
            </p>
            <p className="text-xs text-linkedin-text-secondary flex items-center gap-1 mt-0.5">
              <span>Just now</span>
              <span>·</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z"/>
                <path d="M8 3a.5.5 0 0 1 .5.5V8a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1 0-1H7V3.5A.5.5 0 0 1 8 3z"/>
              </svg>
            </p>
          </div>

          {/* More Button */}
          <button className="text-linkedin-text-secondary hover:bg-gray-100 rounded-full p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Body */}
      <div className="px-4 py-3">
        {isEditing ? (
          <textarea
            value={postText}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full min-h-[200px] text-[14px] leading-[1.5] text-linkedin-text 
                       resize-none outline-none bg-transparent font-normal
                       placeholder:text-linkedin-text-secondary"
            placeholder="Your LinkedIn post will appear here..."
            autoFocus
          />
        ) : (
          <div
            onClick={onEdit}
            className="text-[14px] leading-[1.5] text-linkedin-text whitespace-pre-wrap cursor-text
                       min-h-[100px] hover:bg-blue-50/30 rounded-lg transition-colors p-1 -m-1"
          >
            {postText || (
              <span className="text-linkedin-text-secondary italic">
                Click "Generate Post" to create your LinkedIn post...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Post Image */}
      {imageUrl && (
        <div className="relative group">
          {!imageLoaded && !imageFailed && (
            <div className="w-full h-[314px] shimmer-bg flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full border-[3px] border-linkedin-border border-t-linkedin-blue animate-spin" />
              <span className="text-linkedin-text-secondary text-sm">Generating image...</span>
            </div>
          )}
          {imageFailed && (
            <div className="w-full h-[200px] bg-gray-100 flex flex-col items-center justify-center gap-2 rounded">
              <span className="text-3xl">🖼️</span>
              <span className="text-linkedin-text-secondary text-sm">Image failed to load</span>
            </div>
          )}
          <img
            src={imageUrl}
            alt="AI generated post image"
            className={`w-full object-cover max-h-[400px] ${imageLoaded && !imageFailed ? '' : 'hidden'}`}
            onLoad={() => { setImageLoaded(true); setImageFailed(false); }}
            onError={() => { setImageLoaded(true); setImageFailed(true); onImageError?.(); }}
          />
          {onRemoveImage && (
            <button
              onClick={onRemoveImage}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 
                         flex items-center justify-center text-sm opacity-0 group-hover:opacity-100
                         transition-opacity hover:bg-black/80"
              title="Remove image"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="mx-4 border-t border-linkedin-border" />

      {/* Reaction Bar */}
      <div className="px-2 py-1">
        {/* Fake reactions */}
        <div className="flex items-center gap-1 px-3 py-1">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px]">👍</div>
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px]">❤️</div>
            <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-[10px]">🎉</div>
          </div>
          <span className="text-xs text-linkedin-text-secondary ml-1">24</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-around border-t border-linkedin-border pt-1">
          {[
            { icon: '👍', label: 'Like' },
            { icon: '💬', label: 'Comment' },
            { icon: '🔄', label: 'Repost' },
            { icon: '📤', label: 'Send' },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-4 py-2.5 text-linkedin-text-secondary
                         hover:bg-gray-100 rounded-lg transition-colors text-xs font-semibold"
            >
              <span className="text-base">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
