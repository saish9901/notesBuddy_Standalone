/**
 * NoteCard Component
 * Card displaying note information
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import ConfirmModal from './ConfirmModal';

const NoteCard = ({ note, onDelete, onLikeToggle, onPrivacyToggle }) => {
  const { user, isAuthenticated } = useAuth();
  const { downloadNote, likeNote, unlikeNote, toggleNotePrivacy } = useNotes();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(note.hasLiked || false);
  const [likeCount, setLikeCount] = useState(note.likeCount || 0);
  const [isPrivate, setIsPrivate] = useState(note.isPrivate || false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const isOwner = isAuthenticated && user?.id === note.uploadedBy;

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const result = await downloadNote(note.id, note.title);
    if (result.status === 401) {
      navigate('/login');
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isLiked) {
      const result = await unlikeNote(note.id);
      if (result.success) {
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        if (onLikeToggle) onLikeToggle();
      }
    } else {
      const result = await likeNote(note.id);
      if (result.success) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        if (onLikeToggle) onLikeToggle();
      }
    }
  };

  const handleTogglePrivacy = async () => {
    const result = await toggleNotePrivacy(note.id);
    if (result.success) {
      setIsPrivate(result.isPrivate);
      if (onPrivacyToggle) onPrivacyToggle();
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 flex-grow pr-2">
            {note.title}
          </h3>
          <svg 
            className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
            <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 flex-grow">
          {note.description || 'No description provided'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {note.schoolName && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 sm:px-2.5 py-1 rounded">
              🏫 {note.schoolName}
            </span>
          )}
          {note.disciplineName && (
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs font-medium px-2 sm:px-2.5 py-1 rounded">
              📚 {note.disciplineName}
            </span>
          )}
          <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 text-xs font-medium px-2 sm:px-2.5 py-1 rounded">
            {note.subject}
          </span>
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium px-2 sm:px-2.5 py-1 rounded">
            Sem {note.semester}
          </span>
          {isPrivate && (
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-xs font-medium px-2 sm:px-2.5 py-1 rounded">
              🔒 Private
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {note.viewCount || 0}
          </span>
          <span className="flex items-center">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {note.downloads || 0}
          </span>
          <span className="flex items-center">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {likeCount}
          </span>
        </div>

        {/* Meta info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 gap-1 sm:gap-0">
          <span className="truncate">By {note.uploaderName || 'Anonymous'}</span>
          <span className="text-xs sm:text-sm">{formatDate(note.uploadedAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          {/* Primary action - always full width on mobile */}
          <Link
            to={`/notes/${note.id}`}
            className="w-full sm:flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium text-center transition-colors"
          >
            View Details
          </Link>
          
          {/* Secondary actions row */}
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`flex-1 sm:flex-none sm:px-3 px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium transition-colors ${
                isLiked
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <svg className="w-5 h-5 mx-auto" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none sm:px-3 px-4 py-2.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
              aria-label="Download"
              title="Download"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            {isOwner && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPrivacyModal(true);
                  }}
                  className={`flex-1 sm:flex-none sm:px-3 px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium transition-colors ${
                    isPrivate
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                  aria-label={isPrivate ? 'Make Public' : 'Make Private'}
                  title={isPrivate ? 'Make Public' : 'Make Private'}
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isPrivate ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    )}
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 sm:flex-none sm:px-3 px-4 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                  aria-label="Delete"
                  title="Delete"
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Privacy Toggle Confirmation Modal */}
      <ConfirmModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onConfirm={handleTogglePrivacy}
        title={isPrivate ? "Make Note Public?" : "Make Note Private?"}
        message={
          isPrivate 
            ? "This note will be visible to everyone. Anyone can view and download it."
            : "This note will only be visible to you. Other users won't be able to see or download it."
        }
        confirmText={isPrivate ? "Make Public" : "Make Private"}
        cancelText="Cancel"
        confirmColor={isPrivate ? "green" : "yellow"}
        icon={isPrivate ? "unlock" : "lock"}
      />
    </div>
  );
};

export default NoteCard;
