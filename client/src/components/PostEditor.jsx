import { useState, useRef } from 'react';
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
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

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
    setImageError(false);
    setUploadedImageBase64(null);
    try {
      const data = await generateImage({ postText });
      const apiBase = import.meta.env.VITE_API_URL || '';
      const proxyUrl = `${apiBase}/api/proxy-image?url=${encodeURIComponent(data.imageUrl)}`;
      setOriginalImageUrl(data.imageUrl);
      setImageUrl(proxyUrl);
      toastSuccess('Image generating! Takes 5-10 seconds to render...');
    } catch (err) {
      toastError?.(err.message || 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toastError?.('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toastError?.('Image must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setImageUrl(base64);
      setOriginalImageUrl(null);
      setUploadedImageBase64(base64);
      setImageError(false);
      toastSuccess('Image added!');
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setOriginalImageUrl(null);
    setUploadedImageBase64(null);
    setImageError(false);
  };

  if (!postText) return null;

  const actions = [
    { action: 'regenerate', label: '🔄 Regenerate' },
    { action: 'shorter', label: '✂️ Shorter' },
    { action: 'punchier', label: '💪 Punchier' },
    { action: 'cta', label: '📢 Add CTA' },
  ];

  // Determine what to send for publishing
  const publishPayload = uploadedImageBase64
    ? { type: 'base64', data: uploadedImageBase64 }
    : originalImageUrl
    ? { type: 'url', data: originalImageUrl }
    : null;

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
        imageUrl={imageUrl} onRemoveImage={handleRemoveImage}
        onImageError={() => setImageError(true)} />

      {imageError && imageUrl && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
          <span>⚠️</span>
          <span className="text-amber-700">Image is still generating. Click to retry:</span>
          <button onClick={handleGenerateImage} className="text-linkedin-blue font-semibold hover:underline">
            Regenerate
          </button>
        </div>
      )}

      <CharCounter count={postText.length} />

      {/* AI Actions Row */}
      <div className="flex flex-wrap gap-2">
        {actions.map(({ action, label }) => (
          <button key={action} onClick={() => onRefine(action)}
            disabled={isRefining} className="btn-secondary text-xs py-2 px-3 disabled:opacity-50">
            {isRefining ? <LoadingSpinner size="sm" /> : label}
          </button>
        ))}
        {/* Generate AI Image */}
        <button onClick={handleGenerateImage}
          disabled={isGeneratingImage}
          className="btn-secondary text-xs py-2 px-3 disabled:opacity-50 border-purple-400 text-purple-600 hover:bg-purple-500 hover:text-white hover:border-purple-500">
          {isGeneratingImage ? <><LoadingSpinner size="sm" /> Generating...</> : '🤖 AI Image'}
        </button>
        {/* Upload Own Image */}
        <button onClick={() => fileInputRef.current?.click()}
          className="btn-secondary text-xs py-2 px-3 border-emerald-400 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500">
          📎 Upload Image
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
      </div>

      <HashtagSuggester hashtags={hashtags} isLoading={isLoadingHashtags}
        onSuggest={handleSuggestHashtags} onInsert={handleInsertHashtag} />

      <div className="flex items-center justify-between pt-2 border-t border-linkedin-border">
        <div className="flex items-center gap-2">
          <EmojiToolbar onInsert={(e) => onTextChange(postText + e)} />
          <button onClick={handleCopy} className="btn-ghost text-xs">📋 Copy</button>
          <button onClick={onSaveDraft} className="btn-ghost text-xs">💾 Draft</button>
        </div>
        <button onClick={() => onPublish(publishPayload)} disabled={!isConnected || isPublishing || !postText}
          className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
          title={!isConnected ? 'Connect LinkedIn first' : 'Post to LinkedIn'}>
          {isPublishing ? (<><LoadingSpinner size="sm" /> Publishing...</>) : '🔗 Post to LinkedIn'}
        </button>
      </div>
    </div>
  );
}
