/**
 * NotesList Page
 * Browse and search all available notes
 */

import React, { useEffect, useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const NotesList = () => {
  const { notes, loading, pagination, fetchNotes, searchNotes, deleteNote } = useNotes();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isSearching && searchQuery) {
      searchNotes(searchQuery, currentPage);
    } else {
      fetchNotes(currentPage);
    }
  }, [currentPage]);

  const handleSearch = async (filters) => {
    setSearchQuery(filters);
    const hasSearchCriteria = filters.q || filters.userName || filters.subject || filters.semester;
    
    if (hasSearchCriteria) {
      setIsSearching(true);
      setCurrentPage(1);
      await searchNotes(filters, 1);
    } else {
      setIsSearching(false);
      setCurrentPage(1);
      await fetchNotes(1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Notes</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Explore and download educational resources shared by students
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by title, subject, or semester..."
          />
        </div>

        {/* Results Info */}
        {isSearching && (
          <div className="mb-4 px-4 sm:px-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Showing search results
              {searchQuery.q && <span className="font-semibold"> for "{searchQuery.q}"</span>}
              {' '}({notes.length} found)
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-12">
            <Loader size="large" />
          </div>
        )}

        {/* Notes Grid */}
        {!loading && notes.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && notes.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
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
            <h3 className="mt-2 text-xl font-medium text-gray-900">No notes found</h3>
            <p className="mt-1 text-gray-500">
              {isSearching
                ? 'Try adjusting your search query'
                : 'Be the first to upload notes!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
