/**
 * Profile Page
 * User profile with statistics, uploaded notes, and account management
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const { notes, loading, getMyNotes, deleteNote } = useNotes();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    loadProfile();
    getMyNotes();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Failed to load profile stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    await getMyNotes();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    }
  };

  const handleAccountDeletion = async (e) => {
    e.preventDefault();

    if (!deletePassword) {
      toast.error('Please enter your password');
      return;
    }

    try {
      await authAPI.deleteAccount({ password: deletePassword });
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete account';
      toast.error(message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{user?.name}</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-all">{user?.email}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Member since {formatDate(user?.createdAt)}
              </p>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900 rounded-full p-3 sm:p-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Stats */}
          {loadingStats ? (
            <div className="mt-6">
              <Loader size="small" />
            </div>
          ) : stats && (
            <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                  <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 sm:p-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="sm:ml-3 lg:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Notes</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalNotesUploaded || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                  <div className="bg-green-100 dark:bg-green-800 rounded-full p-2 sm:p-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div className="sm:ml-3 lg:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDownloads || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                  <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-2 sm:p-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="sm:ml-3 lg:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Views</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900 rounded-lg p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                  <div className="bg-red-100 dark:bg-red-800 rounded-full p-2 sm:p-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="sm:ml-3 lg:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Likes</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLikes || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Management */}
          <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Account Management</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm sm:text-base font-medium transition-colors"
              >
                Change Password
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
              >
                Delete Account
              </button>
            </div>

            {/* Change Password Form */}
            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="mt-6 p-6 bg-gray-50 rounded-lg">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                    >
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Delete Account Confirmation */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Delete Account</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    This action cannot be undone. All your notes and data will be permanently deleted.
                  </p>
                  <form onSubmit={handleAccountDeletion}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Enter your password to confirm
                      </label>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md font-medium transition-colors"
                      >
                        Delete Account
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-md font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* My Notes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Uploaded Notes</h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-12">
            <Loader size="large" />
          </div>
        )}

        {/* Notes Grid */}
        {!loading && notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && notes.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">No notes uploaded yet</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Start sharing your knowledge with others!</p>
            <a
              href="/upload"
              className="mt-6 inline-block bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Upload Your First Note
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
