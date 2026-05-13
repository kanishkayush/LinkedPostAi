import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function HashtagSuggester({ hashtags, isLoading, onSuggest, onInsert }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="section-title mb-0"># Hashtag Suggestions</span>
        <button
          type="button"
          onClick={onSuggest}
          disabled={isLoading}
          className="text-xs text-linkedin-blue font-semibold hover:underline disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Generating...' : 'Suggest Hashtags'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-24 shimmer-bg rounded-full" />
          ))}
        </div>
      ) : hashtags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onInsert(tag)}
              className="px-3 py-1.5 bg-blue-50 text-linkedin-blue text-xs font-semibold rounded-full
                         hover:bg-linkedin-blue hover:text-white transition-all duration-200 cursor-pointer
                         hover:-translate-y-0.5 hover:shadow-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-linkedin-text-secondary">
          Click "Suggest Hashtags" to get AI-generated hashtags for your post
        </p>
      )}
    </div>
  );
}
