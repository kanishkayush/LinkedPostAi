import { useState, useCallback } from 'react';
import { generatePost as apiGeneratePost, refinePost as apiRefinePost, suggestHashtags as apiSuggestHashtags } from '../utils/api';

export function usePostGenerator() {
  const [postText, setPostText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState(null);

  const generatePost = useCallback(async ({ topic, project, tone, customInput }) => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await apiGeneratePost({ topic, project, tone, customInput });
      setPostText(data.postText);
      return data.postText;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const refinePost = useCallback(async (action) => {
    if (!postText) return;
    setIsRefining(true);
    setError(null);
    try {
      const data = await apiRefinePost({ postText, action });
      setPostText(data.postText);
      return data.postText;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsRefining(false);
    }
  }, [postText]);

  const getHashtags = useCallback(async () => {
    if (!postText) return [];
    try {
      const data = await apiSuggestHashtags({ postText });
      return data.hashtags;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [postText]);

  const clearPost = useCallback(() => {
    setPostText('');
    setError(null);
  }, []);

  return {
    postText,
    setPostText,
    isGenerating,
    isRefining,
    error,
    generatePost,
    refinePost,
    getHashtags,
    clearPost,
  };
}
