import { useState } from 'react';
import PostPreview from './PostPreview';
import CharCounter from './CharCounter';
import HashtagSuggester from './HashtagSuggester';
import EmojiToolbar from './EmojiToolbar';
import LoadingSpinner from './LoadingSpinner';
import { generateImage } from '../utils/api';

export default function PostEditor({
  postText, onTextChange, onRefine, isRefining,
  onPublish, isPublishing, isConnected,
  onSuggestHashtags, onSaveDraft, toastSuccess, toastError,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [isLoadingHashtags, setIsLoadingHashtags] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleSuggestHashtags = async () => {
    setIsLoadingHashtags(true);
    const tags = await onSuggestHashtags();
    setHashtags(tags || []);
    setIsLoadingHashtags(false);
  };

  const handleInsertHashtag = (tag) => {
    const sep = postText.endsWith('\n') || postText.endsWith(' ') ? '' : ' ';
    onTextChange(postText + sep + tag + ' ');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    toastSuccess('Post copied to clipboard!');
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const data = await generateImage({ postText });
      setImageUrl(data.imageUrl);
      toastSuccess('Image generated! It may take a few seconds to render.');
    } catch (err) {
      toastError?.(err.message || 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (!postText) return null;

  const actions = [
    { action: 'regenerate', label: '🔄 Regenerate' },
    { action: 'shorter', label: '✂️ Shorter' },
    { action: 'punchier', label: '💪 Punchier' },
    { action: 'cta', label: '📢 Add CTA' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-linkedin-text">Preview & Edit</h2>
        <button onClick={() => setIsEditing(!isEditing)} className="btn-ghost text-xs">
          {isEditing ? '✓ Done' : '✏️ Edit'}
        </button>
      </div>

      <PostPreview postText={postText} isEditing={isEditing}
        onEdit={() => setIsEditing(true)} onTextChange={onTextChange}
        imageUrl={imageUrl} onRemoveImage={() => setImageUrl(null)} />

      <CharCounter count={postText.length} />

      {/* AI Actions Row */}
      <div className="flex flex-wrap gap-2">
        {actions.map(({ action, label }) => (
          <button key={action} onClick={() => onRefine(action)}
            disabled={isRefining} className="btn-secondary text-xs py-2 px-3 disabled:opacity-50">
            {isRefining ? <LoadingSpinner size="sm" /> : label}
          </button>
        ))}
        {/* Generate Image Button */}
        <button onClick={handleGenerateImage}
          disabled={isGeneratingImage}
          className="btn-secondary text-xs py-2 px-3 disabled:opacity-50 border-purple-400 text-purple-600 hover:bg-purple-500 hover:text-white hover:border-purple-500">
          {isGeneratingImage ? <><LoadingSpinner size="sm" /> Generating...</> : '🖼️ Generate Image'}
        </button>
      </div>

      <HashtagSuggester hashtags={hashtags} isLoading={isLoadingHashtags}
        onSuggest={handleSuggestHashtags} onInsert={handleInsertHashtag} />

      <div className="flex items-center justify-between pt-2 border-t border-linkedin-border">
        <div className="flex items-center gap-2">
          <EmojiToolbar onInsert={(e) => onTextChange(postText + e)} />
          <button onClick={handleCopy} className="btn-ghost text-xs">📋 Copy</button>
          <button onClick={onSaveDraft} className="btn-ghost text-xs">💾 Draft</button>
        </div>
        <button onClick={onPublish} disabled={!isConnected || isPublishing || !postText}
          className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
          title={!isConnected ? 'Connect LinkedIn first' : 'Post to LinkedIn'}>
          {isPublishing ? (<><LoadingSpinner size="sm" /> Publishing...</>) : '🔗 Post to LinkedIn'}
        </button>
      </div>
    </div>
  );
}
