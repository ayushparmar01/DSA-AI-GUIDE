import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/endpoints';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dsa_auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res.data.success) {
          setUser(res.data.data.user);
          setProfile(res.data.data.profile);
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { user: loggedInUser, profile: userProfile, token: jwtToken } = res.data.data;
      localStorage.setItem('dsa_auth_token', jwtToken);
      setToken(jwtToken);
      setUser(loggedInUser);
      setProfile(userProfile);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (name, email, password, role = 'student') => {
    const res = await authAPI.register({ name, email, password, role });
    if (res.data.success) {
      const { user: newUser, profile: userProfile, token: jwtToken } = res.data.data;
      localStorage.setItem('dsa_auth_token', jwtToken);
      setToken(jwtToken);
      setUser(newUser);
      setProfile(userProfile);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('dsa_auth_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfileData = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.data.success) {
      setProfile(res.data.data);
      if (user) setUser({ ...user, isOnboardingCompleted: true });
      return res.data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        profile,
        setProfile,
        token,
        loading,
        login,
        register,
        logout,
        updateProfileData,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
