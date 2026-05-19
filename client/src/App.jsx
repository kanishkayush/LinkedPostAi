import { useState } from 'react';
import { usePostGenerator } from './hooks/usePostGenerator';
import { useLinkedIn } from './hooks/useLinkedIn';
import { useHistory } from './hooks/useHistory';
import { useToast } from './hooks/useToast';
import PostGenerator from './components/PostGenerator';
import PostEditor from './components/PostEditor';
import PostHistory from './components/PostHistory';
import Settings from './components/Settings';
import Toast from './components/Toast';
import { PROFILE } from './utils/constants';

const TABS = [
  { id: 'generator', label: 'Generator', icon: '✨' },
  { id: 'history', label: 'History', icon: '📋' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [isPublishing, setIsPublishing] = useState(false);

  const { postText, setPostText, isGenerating, isRefining, generatePost, refinePost, getHashtags, clearPost } = usePostGenerator();
  const { auth, isConnected, connect, disconnect, publishPost } = useLinkedIn();
  const { history, addToHistory, updatePostStatus, deleteFromHistory, clearHistory } = useHistory();
  const { toasts, removeToast, success, error, info } = useToast();

  const handleGenerate = async (params) => {
    try {
      await generatePost(params);
      success('Post generated successfully!');
    } catch (err) {
      error(err.message);
    }
  };

  const handleRefine = async (action) => {
    try {
      await refinePost(action);
      success(`Post refined: ${action}`);
    } catch (err) {
      error(err.message);
    }
  };

  const handlePublish = async (imageUrl) => {
    if (!postText || !isConnected) return;
    setIsPublishing(true);
    try {
      const result = await publishPost(postText, imageUrl);
      addToHistory({
        content: postText,
        status: 'posted',
        postedAt: new Date().toISOString(),
        linkedinPostId: result.postId,
      });
      success('🎉 Post published to LinkedIn!');
      clearPost();
    } catch (err) {
      error(`Failed to publish: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = () => {
    if (!postText) return;
    addToHistory({ content: postText, status: 'draft' });
    info('Draft saved to history');
  };

  const handleUsePost = (content) => {
    setPostText(content);
    setActiveTab('generator');
    info('Post loaded into editor');
  };

  return (
    <div className="min-h-screen bg-linkedin-bg">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-linkedin-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-linkedin-blue to-linkedin-blue-dark flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-linkedin-text leading-tight">LinkedIn AI Agent</h1>
              <p className="text-[10px] text-linkedin-text-secondary leading-tight">Powered by AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Connection Badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              ${isConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              {isConnected ? auth?.name || 'Connected' : 'Not Connected'}
            </div>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-linkedin-blue to-linkedin-blue-dark flex items-center justify-center">
              <span className="text-white text-xs font-bold">{PROFILE.initials}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="sticky top-14 z-30 bg-white border-b border-linkedin-border">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold transition-all relative
                  ${activeTab === tab.id
                    ? 'text-linkedin-blue'
                    : 'text-linkedin-text-secondary hover:text-linkedin-text hover:bg-gray-50'
                  }`}>
                <span className="mr-1.5">{tab.icon}</span>{tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linkedin-blue rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className={activeTab === 'generator' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}>
          {activeTab === 'generator' && (
            <>
              <div className="card p-6">
                <PostGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />
              </div>
              <div className="card p-6">
                <PostEditor
                  postText={postText}
                  onTextChange={setPostText}
                  onRefine={handleRefine}
                  isRefining={isRefining}
                  onPublish={handlePublish}
                  isPublishing={isPublishing}
                  isConnected={isConnected}
                  onSuggestHashtags={getHashtags}
                  onSaveDraft={handleSaveDraft}
                  toastSuccess={success}
                  toastError={error}
                />
                {!postText && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    <h3 className="text-lg font-semibold text-linkedin-text mb-2">Ready to create</h3>
                    <p className="text-sm text-linkedin-text-secondary max-w-xs">
                      Select a topic, project, and tone, then hit generate to craft your perfect LinkedIn post.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <PostHistory history={history} onDelete={deleteFromHistory}
              onClear={clearHistory} onUsePost={handleUsePost} />
          )}

          {activeTab === 'settings' && (
            <Settings auth={auth} isConnected={isConnected}
              onConnect={connect} onDisconnect={disconnect} />
          )}
        </div>
      </main>

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
