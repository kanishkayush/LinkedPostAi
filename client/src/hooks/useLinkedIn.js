import { useState, useEffect, useCallback } from 'react';
import { postToLinkedIn as apiPostToLinkedIn } from '../utils/api';

const STORAGE_KEY = 'linkedin_auth';

export function useLinkedIn() {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Check URL params for LinkedIn OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('linkedin_token');
    const userId = params.get('linkedin_user_id');
    const name = params.get('linkedin_name');
    const expires = params.get('linkedin_expires');
    const error = params.get('linkedin_error');

    if (error) {
      console.error('LinkedIn OAuth error:', error);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    if (token && userId) {
      const authData = {
        accessToken: token,
        userId,
        name: name || 'LinkedIn User',
        expiresAt: Date.now() + (parseInt(expires) || 3600) * 1000,
        connectedAt: new Date().toISOString(),
      };
      setAuth(authData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const isConnected = auth && auth.accessToken && Date.now() < auth.expiresAt;

  const connect = useCallback(() => {
    const apiBase = import.meta.env.VITE_API_URL || '';
    window.location.href = `${apiBase}/auth/linkedin`;
  }, []);

  const disconnect = useCallback(() => {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const publishPost = useCallback(async (postText) => {
    if (!auth) throw new Error('Not connected to LinkedIn');
    
    const result = await apiPostToLinkedIn({
      postText,
      accessToken: auth.accessToken,
      userId: auth.userId,
    });

    return result;
  }, [auth]);

  return {
    auth,
    isConnected,
    connect,
    disconnect,
    publishPost,
  };
}
