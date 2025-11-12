/**
 * Notes Context - LocalStorage Version
 * Manages notes state and operations using browser localStorage only
 */

import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 20,
    totalItems: 0,
  });

  // Initialize notes storage if not exists
  useEffect(() => {
    const storedNotes = localStorage.getItem('notesBuddy_notes');
    if (!storedNotes) {
      localStorage.setItem('notesBuddy_notes', JSON.stringify([]));
    }

    const storedLikes = localStorage.getItem('notesBuddy_likes');
    if (!storedLikes) {
      localStorage.setItem('notesBuddy_likes', JSON.stringify([]));
    }
  }, []);

  // Helper function to get current user
  const getCurrentUser = () => {
    const user = localStorage.getItem('notesBuddy_currentUser');
    return user ? JSON.parse(user) : null;
  };

  // Helper function to get user by ID
  const getUserById = (userId) => {
    const users = JSON.parse(localStorage.getItem('notesBuddy_users') || '[]');
    return users.find(u => u.id === userId);
  };

  // Helper function to calculate pagination
  const calculatePagination = (allNotes, page, limit) => {
    const totalItems = allNotes.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotes = allNotes.slice(startIndex, endIndex);

    return {
      notes: paginatedNotes,
      pagination: {
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
        totalItems,
      },
    };
  };

  // Fetch all notes (public notes only, unless viewing own notes)
  const fetchNotes = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');
      
      // Filter to show only public notes or user's own notes
      const visibleNotes = allNotes.filter(note => 
        !note.isPrivate || (currentUser && note.uploadedBy === currentUser.id)
      );

      // Add user information to each note
      const notesWithUserInfo = visibleNotes.map(note => {
        const user = getUserById(note.uploadedBy);
        return {
          ...note,
          uploaderName: note.uploaderName || user?.name || 'Anonymous',
          userName: note.uploaderName || user?.name || 'Anonymous',
          userEmail: user?.email || '',
        };
      });

      // Sort by most recent first
      notesWithUserInfo.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

      const result = calculatePagination(notesWithUserInfo, page, limit);
      setNotes(result.notes);
      setPagination(result.pagination);

      return { success: true, data: result.notes };
    } catch (error) {
      toast.error('Failed to fetch notes');
      return { success: false, message: 'Failed to fetch notes' };
    } finally {
      setLoading(false);
    }
  };

  // Search notes with advanced filters
  const searchNotes = async (filters, page = 1, limit = 20) => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');
      
      // Filter notes based on privacy and search criteria
      let filteredNotes = allNotes.filter(note => 
        !note.isPrivate || (currentUser && note.uploadedBy === currentUser.id)
      );

      // Apply search filters
      if (filters.q) {
        const searchTerm = filters.q.toLowerCase();
        filteredNotes = filteredNotes.filter(note =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.description?.toLowerCase().includes(searchTerm) ||
          note.subject.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.subject) {
        filteredNotes = filteredNotes.filter(note =>
          note.subject.toLowerCase().includes(filters.subject.toLowerCase())
        );
      }

      if (filters.semester) {
        filteredNotes = filteredNotes.filter(note =>
          note.semester.toLowerCase().includes(filters.semester.toLowerCase())
        );
      }

      if (filters.schoolName) {
        filteredNotes = filteredNotes.filter(note =>
          note.schoolName.toLowerCase().includes(filters.schoolName.toLowerCase())
        );
      }

      if (filters.disciplineName) {
        filteredNotes = filteredNotes.filter(note =>
          note.disciplineName.toLowerCase().includes(filters.disciplineName.toLowerCase())
        );
      }

      if (filters.userName) {
        filteredNotes = filteredNotes.filter(note => {
          const user = getUserById(note.uploadedBy);
          return user?.name.toLowerCase().includes(filters.userName.toLowerCase());
        });
      }

      // Add user information
      const notesWithUserInfo = filteredNotes.map(note => {
        const user = getUserById(note.uploadedBy);
        return {
          ...note,
          uploaderName: note.uploaderName || user?.name || 'Anonymous',
          userName: note.uploaderName || user?.name || 'Anonymous',
          userEmail: user?.email || '',
        };
      });

      // Apply sorting
      const sortBy = filters.sortBy || 'uploadedAt';
      const sortOrder = filters.sortOrder || 'desc';

      notesWithUserInfo.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortBy === 'uploadedAt') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      const result = calculatePagination(notesWithUserInfo, page, limit);
      setNotes(result.notes);
      setPagination(result.pagination);

      return { success: true, data: { results: result.notes } };
    } catch (error) {
      toast.error('Search failed');
      return { success: false, message: 'Search failed' };
    } finally {
      setLoading(false);
    }
  };

  // Upload note with PDF as base64
  const uploadNote = async (formData) => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to upload notes');
        return { success: false, message: 'Not authenticated' };
      }

      // Convert file to base64
      const file = formData.get('file');
      let fileBase64 = '';
      let fileName = '';

      if (file) {
        fileName = file.name;
        fileBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');

      // Create new note object
      const newNote = {
        id: Date.now(),
        title: formData.get('title'),
        description: formData.get('description') || '',
        schoolName: formData.get('schoolName'),
        disciplineName: formData.get('disciplineName'),
        subject: formData.get('subject'),
        semester: formData.get('semester'),
        filePath: fileBase64,
        fileName: fileName,
        uploadedBy: currentUser.id,
        uploaderName: currentUser.name,
        isPrivate: formData.get('isPrivate') === 'true',
        downloads: 0,
        viewCount: 0,
        likeCount: 0,
        uploadedAt: new Date().toISOString(),
      };

      allNotes.push(newNote);
      localStorage.setItem('notesBuddy_notes', JSON.stringify(allNotes));

      toast.success('Note uploaded successfully!');
      return { success: true, data: newNote };
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
      return { success: false, message: 'Upload failed' };
    } finally {
      setLoading(false);
    }
  };

  // Get note by ID
  const getNoteById = async (id) => {
    setLoading(true);
    try {
      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');
      const note = allNotes.find(n => n.id === parseInt(id));

      if (!note) {
        toast.error('Note not found');
        return { success: false, message: 'Note not found' };
      }

      const currentUser = getCurrentUser();
      
      // Check if user can view this note
      if (note.isPrivate && (!currentUser || note.uploadedBy !== currentUser.id)) {
        toast.error('This note is private');
        return { success: false, message: 'Unauthorized' };
      }

      // Increment view count
      note.viewCount = (note.viewCount || 0) + 1;
      const noteIndex = allNotes.findIndex(n => n.id === parseInt(id));
      allNotes[noteIndex] = note;
      localStorage.setItem('notesBuddy_notes', JSON.stringify(allNotes));

      // Add user information
      const user = getUserById(note.uploadedBy);
      const noteWithUserInfo = {
        ...note,
        uploaderName: note.uploaderName || user?.name || 'Anonymous',
        userName: note.uploaderName || user?.name || 'Anonymous',
        userEmail: user?.email || '',
      };

      // Check if user has liked this note
      if (currentUser) {
        const likes = JSON.parse(localStorage.getItem('notesBuddy_likes') || '[]');
        noteWithUserInfo.isLiked = likes.some(
          like => like.userId === currentUser.id && like.noteId === note.id
        );
      }

      return { success: true, data: noteWithUserInfo };
    } catch (error) {
      toast.error('Failed to fetch note');
      return { success: false, message: 'Failed to fetch note' };
    } finally {
      setLoading(false);
    }
  };

  // Download note
  const downloadNote = async (id, title) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to download notes');
        return { success: false, message: 'Not authenticated', status: 401 };
      }

      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');
      const noteIndex = allNotes.findIndex(n => n.id === parseInt(id));
      
      if (noteIndex === -1) {
        toast.error('Note not found');
        return { success: false, message: 'Note not found' };
      }

      const note = allNotes[noteIndex];

      // Check if user can download this note
      if (note.isPrivate && note.uploadedBy !== currentUser.id) {
        toast.error('This note is private');
        return { success: false, message: 'Unauthorized' };
      }

      // Increment download count
      allNotes[noteIndex].downloads = (allNotes[noteIndex].downloads || 0) + 1;
      localStorage.setItem('notesBuddy_notes', JSON.stringify(allNotes));

      // Download the base64 PDF
      const link = document.createElement('a');
      link.href = note.filePath;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started!');
      return { success: true };
    } catch (error) {
      toast.error('Download failed');
      return { success: false, message: 'Download failed' };
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to delete notes');
        return { success: false, message: 'Not authenticated' };
      }

      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');
      const noteIndex = allNotes.findIndex(n => n.id === parseInt(id));

      if (noteIndex === -1) {
        toast.error('Note not found');
        return { success: false, message: 'Note not found' };
      }

      // Check if user owns this note
      if (allNotes[noteIndex].uploadedBy !== currentUser.id) {
        toast.error('You can only delete your own notes');
        return { success: false, message: 'Unauthorized' };
      }

      // Delete the note
      allNotes.splice(noteIndex, 1);
      localStorage.setItem('notesBuddy_notes', JSON.stringify(allNotes));

      // Delete associated likes
      const likes = JSON.parse(localStorage.getItem('notesBuddy_likes') || '[]');
      const updatedLikes = likes.filter(like => like.noteId !== parseInt(id));
      localStorage.setItem('notesBuddy_likes', JSON.stringify(updatedLikes));

      setNotes(notes.filter(note => note.id !== parseInt(id)));
      toast.success('Note deleted successfully!');
      return { success: true };
    } catch (error) {
      toast.error('Delete failed');
      return { success: false, message: 'Delete failed' };
    }
  };

  // Get user's notes
  const getMyNotes = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to view your notes');
        return { success: false, message: 'Not authenticated' };
      }

      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');
      const myNotes = allNotes.filter(note => note.uploadedBy === currentUser.id);

      // Add user information
      const notesWithUserInfo = myNotes.map(note => ({
        ...note,
        userName: currentUser.name,
        userEmail: currentUser.email,
      }));

      // Sort by most recent first
      notesWithUserInfo.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

      const result = calculatePagination(notesWithUserInfo, page, limit);
      setNotes(result.notes);
      setPagination(result.pagination);

      return { success: true, data: { notes: result.notes } };
    } catch (error) {
      toast.error('Failed to fetch your notes');
      return { success: false, message: 'Failed to fetch your notes' };
    } finally {
      setLoading(false);
    }
  };

  // Like a note
  const likeNote = async (id) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to like notes');
        return { success: false, message: 'Not authenticated' };
      }

      const likes = JSON.parse(localStorage.getItem('notesBuddy_likes') || '[]');
      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');

      // Check if already liked
      const existingLike = likes.find(
        like => like.userId === currentUser.id && like.noteId === parseInt(id)
      );

      if (existingLike) {
        toast.error('You already liked this note');
        return { success: false, message: 'Already liked' };
      }

      // Add like
      likes.push({
        id: Date.now(),
        userId: currentUser.id,
        noteId: parseInt(id),
        likedAt: new Date().toISOString(),
      });
      localStorage.setItem('notesBuddy_likes', JSON.stringify(likes));

      // Increment like count
      const noteIndex = allNotes.findIndex(n => n.id === parseInt(id));
      if (noteIndex !== -1) {
        allNotes[noteIndex].likeCount = (allNotes[noteIndex].likeCount || 0) + 1;
        localStorage.setItem('notesBuddy_notes', JSON.stringify(allNotes));
      }

      toast.success('Note liked!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to like note');
      return { success: false, message: 'Failed to like note' };
    }
  };

  // Unlike a note
  const unlikeNote = async (id) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to unlike notes');
        return { success: false, message: 'Not authenticated' };
      }

      const likes = JSON.parse(localStorage.getItem('notesBuddy_likes') || '[]');
      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');

      // Find and remove like
      const likeIndex = likes.findIndex(
        like => like.userId === currentUser.id && like.noteId === parseInt(id)
      );

      if (likeIndex === -1) {
        toast.error('You have not liked this note');
        return { success: false, message: 'Not liked' };
      }

      likes.splice(likeIndex, 1);
      localStorage.setItem('notesBuddy_likes', JSON.stringify(likes));

      // Decrement like count
      const noteIndex = allNotes.findIndex(n => n.id === parseInt(id));
      if (noteIndex !== -1) {
        allNotes[noteIndex].likeCount = Math.max((allNotes[noteIndex].likeCount || 0) - 1, 0);
        localStorage.setItem('notesBuddy_notes', JSON.stringify(allNotes));
      }

      toast.success('Like removed!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to unlike note');
      return { success: false, message: 'Failed to unlike note' };
    }
  };

  // Get liked notes
  const getLikedNotes = async () => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to view liked notes');
        return { success: false, message: 'Not authenticated' };
      }

      const likes = JSON.parse(localStorage.getItem('notesBuddy_likes') || '[]');
      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');

      // Get note IDs that user has liked
      const likedNoteIds = likes
        .filter(like => like.userId === currentUser.id)
        .map(like => like.noteId);

      // Get the actual notes
      const likedNotes = allNotes.filter(note => likedNoteIds.includes(note.id));

      // Add user information
      const notesWithUserInfo = likedNotes.map(note => {
        const user = getUserById(note.uploadedBy);
        return {
          ...note,
          userName: user?.name || 'Unknown User',
          userEmail: user?.email || '',
          isLiked: true,
        };
      });

      // Sort by most recently liked first
      const sortedLikes = likes
        .filter(like => like.userId === currentUser.id)
        .sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));

      const sortedNotes = sortedLikes
        .map(like => notesWithUserInfo.find(note => note.id === like.noteId))
        .filter(Boolean);

      setNotes(sortedNotes);
      return { success: true, data: { notes: sortedNotes } };
    } catch (error) {
      toast.error('Failed to fetch liked notes');
      return { success: false, message: 'Failed to fetch liked notes' };
    } finally {
      setLoading(false);
    }
  };

  // Toggle note privacy
  const toggleNotePrivacy = async (id) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to change privacy');
        return { success: false, message: 'Not authenticated' };
      }

      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');
      const noteIndex = allNotes.findIndex(n => n.id === parseInt(id));

      if (noteIndex === -1) {
        toast.error('Note not found');
        return { success: false, message: 'Note not found' };
      }

      // Check if user owns this note
      if (allNotes[noteIndex].uploadedBy !== currentUser.id) {
        toast.error('You can only change privacy of your own notes');
        return { success: false, message: 'Unauthorized' };
      }

      // Toggle privacy
      allNotes[noteIndex].isPrivate = !allNotes[noteIndex].isPrivate;
      localStorage.setItem('notesBuddy_notes', JSON.stringify(allNotes));

      toast.success('Note privacy updated!');
      return { success: true, isPrivate: allNotes[noteIndex].isPrivate };
    } catch (error) {
      toast.error('Failed to update privacy');
      return { success: false, message: 'Failed to update privacy' };
    }
  };

  // Update note
  const updateNote = async (id, updates) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error('Please login to update notes');
        return { success: false, message: 'Not authenticated' };
      }

      const allNotes = JSON.parse(localStorage.getItem('notesBuddy_notes') || '[]');
      const noteIndex = allNotes.findIndex(n => n.id === parseInt(id));

      if (noteIndex === -1) {
        toast.error('Note not found');
        return { success: false, message: 'Note not found' };
      }

      // Check if user owns this note
      if (allNotes[noteIndex].uploadedBy !== currentUser.id) {
        toast.error('You can only update your own notes');
        return { success: false, message: 'Unauthorized' };
      }

      // Update note
      allNotes[noteIndex] = {
        ...allNotes[noteIndex],
        ...updates,
        id: allNotes[noteIndex].id, // Preserve ID
        uploadedBy: allNotes[noteIndex].uploadedBy, // Preserve owner
        uploadedAt: allNotes[noteIndex].uploadedAt, // Preserve upload date
      };
      localStorage.setItem('notesBuddy_notes', JSON.stringify(allNotes));

      toast.success('Note updated successfully!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to update note');
      return { success: false, message: 'Failed to update note' };
    }
  };

  const value = {
    notes,
    loading,
    pagination,
    fetchNotes,
    searchNotes,
    uploadNote,
    getNoteById,
    downloadNote,
    deleteNote,
    getMyNotes,
    likeNote,
    unlikeNote,
    getLikedNotes,
    toggleNotePrivacy,
    updateNote,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
