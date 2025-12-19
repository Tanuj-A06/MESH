/**
 * API Service Layer
 * Centralized HTTP client for communicating with the Django backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Get the JWT access token from localStorage
 */
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

/**
 * Get the JWT refresh token from localStorage
 */
const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

/**
 * Make an authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getAccessToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle token refresh if needed
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the original request with new token
      config.headers['Authorization'] = `Bearer ${getAccessToken()}`;
      return fetch(`${API_BASE_URL}${endpoint}`, config);
    }
  }

  return response;
};

/**
 * Refresh the access token using the refresh token
 */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/jwt/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }

  // Clear tokens if refresh fails
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return false;
};

// ======================
// AUTH API
// ======================

export const authAPI = {
  /**
   * Login with Google OAuth token
   * This creates a user in Django if they don't exist
   */
  googleLogin: async (googleToken) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/google/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: googleToken }),
    });
    return response.json();
  },

  /**
   * Get current user info
   */
  getCurrentUser: async () => {
    const response = await apiRequest('/api/auth/users/me/');
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get current user');
  },

  /**
   * Logout - clear tokens
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};

// ======================
// PROFILE API
// ======================

export const profileAPI = {
  /**
   * Get current user's profile
   */
  getMyProfile: async () => {
    const response = await apiRequest('/api/v1/profiles/me/');
    if (response.ok) {
      return response.json();
    }
    if (response.status === 404) {
      return null; // Profile doesn't exist yet
    }
    throw new Error('Failed to get profile');
  },

  /**
   * Create or update user profile
   */
  createOrUpdateProfile: async (profileData) => {
    const response = await apiRequest('/api/v1/profiles/create_profile/', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    if (response.ok) {
      return response.json();
    }
    const error = await response.json();
    throw new Error(error.detail || 'Failed to save profile');
  },

  /**
   * Get profile by ID
   */
  getProfile: async (profileId) => {
    const response = await apiRequest(`/api/v1/profiles/${profileId}/`);
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get profile');
  },

  /**
   * Get suggested matches (top 10)
   */
  getSuggestions: async () => {
    const response = await apiRequest('/api/v1/profiles/suggestions/');
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get suggestions');
  },

  /**
   * Like a profile
   */
  likeProfile: async (profileId) => {
    const response = await apiRequest(`/api/v1/profiles/${profileId}/like/`, {
      method: 'POST',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to like profile');
  },

  /**
   * Unlike a profile
   */
  unlikeProfile: async (profileId) => {
    const response = await apiRequest(`/api/v1/profiles/${profileId}/unlike/`, {
      method: 'POST',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to unlike profile');
  },
};

// ======================
// SKILLS API
// ======================

export const skillsAPI = {
  /**
   * Get all available skills
   */
  getAllSkills: async () => {
    const response = await apiRequest('/api/v1/skills/');
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get skills');
  },

  /**
   * Get skills by category
   */
  getSkillsByCategory: async (category) => {
    const response = await apiRequest(`/api/v1/skills/by_category/?category=${category}`);
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get skills by category');
  },
};

// ======================
// LIKES API
// ======================

export const likesAPI = {
  /**
   * Get likes received by current user
   */
  getLikesReceived: async () => {
    const response = await apiRequest('/api/v1/likes/likes_received/');
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get likes received');
  },

  /**
   * Get likes given by current user
   */
  getLikesGiven: async () => {
    const response = await apiRequest('/api/v1/likes/likes_given/');
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get likes given');
  },
};

// ======================
// MATCHES API
// ======================

export const matchesAPI = {
  /**
   * Get all matches for current user
   */
  getMatches: async () => {
    const response = await apiRequest('/api/v1/matches/');
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get matches');
  },

  /**
   * Get other user in a match
   */
  getOtherUser: async (matchId) => {
    const response = await apiRequest(`/api/v1/matches/${matchId}/other_user/`);
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get other user');
  },
};

// ======================
// CHAT API
// ======================

export const chatAPI = {
  /**
   * Get messages for a specific match
   */
  getMessages: async (matchId) => {
    const response = await apiRequest(`/api/v1/messages/by_match/?match_id=${matchId}`);
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get messages');
  },

  /**
   * Send a message (HTTP fallback)
   */
  sendMessage: async (matchId, message) => {
    const response = await apiRequest('/api/v1/messages/', {
      method: 'POST',
      body: JSON.stringify({ match: matchId, message }),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to send message');
  },

  /**
   * Mark message as read
   */
  markAsRead: async (messageId) => {
    const response = await apiRequest(`/api/v1/messages/${messageId}/mark_as_read/`, {
      method: 'POST',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to mark message as read');
  },
};

// ======================
// WEBSOCKET CONNECTION
// ======================

export const createChatWebSocket = (matchId, onMessage, onError) => {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
  const token = getAccessToken();
  
  const ws = new WebSocket(`${wsUrl}/ws/chat/${matchId}/?token=${token}`);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket closed');
  };
  
  return {
    send: (message) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ message }));
      }
    },
    close: () => ws.close(),
  };
};

export default {
  auth: authAPI,
  profile: profileAPI,
  skills: skillsAPI,
  likes: likesAPI,
  matches: matchesAPI,
  chat: chatAPI,
  createChatWebSocket,
};
