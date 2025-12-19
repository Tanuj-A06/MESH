/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Try to fetch the profile
          try {
            const profileData = await profileAPI.getMyProfile();
            setProfile(profileData);
          } catch (err) {
            // Profile might not exist yet, that's okay
            console.log('Profile not found, user needs to create one');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login with Google OAuth credential
   * @param {string} googleCredential - JWT token from Google OAuth
   * @param {object} decodedUser - Decoded user info from Google token
   */
  const loginWithGoogle = async (googleCredential, decodedUser) => {
    try {
      // Call backend to authenticate with Google
      const response = await authAPI.googleLogin(googleCredential);
      
      if (response.access) {
        // Store tokens
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('user', JSON.stringify(decodedUser));
        
        setUser(decodedUser);
        setIsAuthenticated(true);
        
        // Try to fetch existing profile
        try {
          const profileData = await profileAPI.getMyProfile();
          setProfile(profileData);
          return { success: true, hasProfile: !!profileData };
        } catch {
          return { success: true, hasProfile: false };
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  /**
   * Update the user's profile
   * @param {object} profileData - Profile data to save
   */
  const updateProfile = async (profileData) => {
    try {
      const updatedProfile = await profileAPI.createOrUpdateProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  /**
   * Refresh the profile from the server
   */
  const refreshProfile = async () => {
    try {
      const profileData = await profileAPI.getMyProfile();
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Profile refresh error:', error);
      throw error;
    }
  };

  /**
   * Logout the user
   */
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    loginWithGoogle,
    updateProfile,
    refreshProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
