/**
 * NoteDetails Page
 * Detailed view of a single note with download option
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNoteById, downloadNote, deleteNote, toggleNotePrivacy } = useNotes();
  const { user, isAuthenticated } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    setLoading(true);
    const result = await getNoteById(id);
    if (result.success) {
      setNote(result.data);
      setIsPrivate(result.data.isPrivate);
    } else {
      navigate('/notes');
    }
    setLoading(false);
  };

  const handleDownload = () => {
    downloadNote(note.id, note.title);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const result = await deleteNote(note.id);
      if (result.success) {
        navigate('/notes');
      }
    }
  };

  const handleTogglePrivacy = async () => {
    const result = await toggleNotePrivacy(note.id);
    if (result.success) {
      setIsPrivate(result.isPrivate);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <Loader fullScreen />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">Note not found</p>
          <Link to="/notes" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 mt-4 inline-block">
            ← Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === note.uploadedBy;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/notes"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Notes
        </Link>

        {/* Note Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 dark:bg-primary-700 px-4 sm:px-6 py-6 sm:py-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-2">{note.title}</h1>
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                  <span className="bg-white bg-opacity-20 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {note.subject}
                  </span>
                  <span className="bg-white bg-opacity-20 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    Semester {note.semester}
                  </span>
                  {isPrivate && (
                    <span className="bg-red-500 bg-opacity-90 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Private
                    </span>
                  )}
                  <span className="bg-white bg-opacity-20 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {note.downloads || 0} downloads
                  </span>
                </div>
              </div>
              <svg className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {note.description || 'No description provided'}
              </p>
            </div>

            {/* Meta Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Uploaded by</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white">{note.uploaderName}</dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Upload date</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white">{formatDate(note.uploadedAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Subject</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white">{note.subject}</dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Semester</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white">{note.semester}</dd>
                </div>
              </dl>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleDownload}
                className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 sm:px-6 py-3 rounded-md text-sm sm:text-base font-medium transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-md text-sm sm:text-base font-medium transition-colors flex items-center justify-center ${
                      isPrivate
                        ? 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white'
                    }`}
                    title={isPrivate ? 'Make Public' : 'Make Private'}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isPrivate ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      )}
                    </svg>
                    <span className="hidden sm:inline">{isPrivate ? 'Make Public' : 'Make Private'}</span>
                    <span className="sm:hidden">{isPrivate ? 'Public' : 'Private'}</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 sm:px-6 py-3 rounded-md text-sm sm:text-base font-medium transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
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

export default NoteDetails;
