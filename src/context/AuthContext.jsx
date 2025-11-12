/**
 * Authentication Context - LocalStorage Version
 * Manages user authentication state using browser localStorage only
 */

import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize users storage if not exists
  useEffect(() => {
    const users = localStorage.getItem('notesBuddy_users');
    if (!users) {
      localStorage.setItem('notesBuddy_users', JSON.stringify([]));
    }

    // Check if user is logged in
    const currentUser = localStorage.getItem('notesBuddy_currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('notesBuddy_currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (name, email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('notesBuddy_users') || '[]');
      
      // Check if email already exists
      if (users.find(u => u.email === email)) {
        toast.error('Email already registered');
        return { success: false, message: 'Email already registered' };
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In production, this would be hashed
        createdAt: new Date().toISOString(),
      };

      // Save to users array
      users.push(newUser);
      localStorage.setItem('notesBuddy_users', JSON.stringify(users));

      // Set as current user (without password)
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      localStorage.setItem('notesBuddy_currentUser', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      setIsAuthenticated(true);

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      toast.error('Registration failed');
      return { success: false, message: 'Registration failed' };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('notesBuddy_users') || '[]');
      
      // Find user
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        toast.error('Invalid email or password');
        return { success: false, message: 'Invalid credentials' };
      }

      // Set as current user (without password)
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      localStorage.setItem('notesBuddy_currentUser', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      setIsAuthenticated(true);

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error('Login failed');
      return { success: false, message: 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('notesBuddy_currentUser');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Update profile
  const updateProfile = async (data) => {
    try {
      const users = JSON.parse(localStorage.getItem('notesBuddy_users') || '[]');
      
      // Find and update user
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        toast.error('User not found');
        return { success: false, message: 'User not found' };
      }

      // Check if new email already exists (for other users)
      if (data.email && data.email !== user.email) {
        const emailExists = users.find(u => u.email === data.email && u.id !== user.id);
        if (emailExists) {
          toast.error('Email already in use');
          return { success: false, message: 'Email already in use' };
        }
      }

      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        name: data.name || users[userIndex].name,
        email: data.email || users[userIndex].email,
      };

      localStorage.setItem('notesBuddy_users', JSON.stringify(users));

      // Update current user
      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      
      localStorage.setItem('notesBuddy_currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      toast.error('Update failed');
      return { success: false, message: 'Update failed' };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const users = JSON.parse(localStorage.getItem('notesBuddy_users') || '[]');
      
      // Find user
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        toast.error('User not found');
        return { success: false, message: 'User not found' };
      }

      // Verify current password
      if (users[userIndex].password !== currentPassword) {
        toast.error('Current password is incorrect');
        return { success: false, message: 'Current password is incorrect' };
      }

      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem('notesBuddy_users', JSON.stringify(users));

      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      toast.error('Password change failed');
      return { success: false, message: 'Password change failed' };
    }
  };

  // Delete account
  const deleteAccount = async (password) => {
    try {
      const users = JSON.parse(localStorage.getItem('notesBuddy_users') || '[]');
      
      // Find user
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        toast.error('User not found');
        return { success: false, message: 'User not found' };
      }

      // Verify password
      if (users[userIndex].password !== password) {
        toast.error('Incorrect password');
        return { success: false, message: 'Incorrect password' };
      }

      // Delete all user's notes
      const notes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');
      const updatedNotes = notes.filter(note => note.uploadedBy !== user.id);
      localStorage.setItem('notesBuddy_notes', JSON.stringify(updatedNotes));

      // Delete user
      users.splice(userIndex, 1);
      localStorage.setItem('notesBuddy_users', JSON.stringify(users));

      // Logout
      logout();

      toast.success('Account deleted successfully');
      return { success: true };
    } catch (error) {
      toast.error('Account deletion failed');
      return { success: false, message: 'Account deletion failed' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
