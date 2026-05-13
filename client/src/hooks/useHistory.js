import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'linkedin_post_history';

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((post) => {
    const entry = {
      id: Date.now().toString(),
      content: post.content,
      topic: post.topic || '',
      project: post.project || '',
      tone: post.tone || '',
      status: post.status || 'draft', // 'draft' | 'posted'
      createdAt: new Date().toISOString(),
      postedAt: post.postedAt || null,
      linkedinPostId: post.linkedinPostId || null,
    };

    setHistory((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const updatePostStatus = useCallback((id, updates) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const deleteFromHistory = useCallback((id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    updatePostStatus,
    deleteFromHistory,
    clearHistory,
  };
}
