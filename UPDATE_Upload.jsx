/**
 * Upload Page - LocalStorage Version
 * Form for uploading new notes with base64 PDF encoding
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    schoolName: '',
    disciplineName: '',
    subject: '',
    semester: '',
    isPrivate: false,
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { uploadNote } = useNotes();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must not exceed 2000 characters';
    }

    if (!formData.schoolName || formData.schoolName.trim().length < 2) {
      newErrors.schoolName = 'School name is required';
    }

    if (!formData.disciplineName || formData.disciplineName.trim().length < 2) {
      newErrors.disciplineName = 'Discipline name is required';
    }

    if (!formData.subject || formData.subject.trim().length < 2) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.semester || formData.semester.trim().length < 1) {
      newErrors.semester = 'Semester is required';
    }

    if (!file) {
      newErrors.file = 'Please select a PDF file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Convert PDF to base64
      const reader = new FileReader();
      
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;

      // Create data object for localStorage
      const noteData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        schoolName: formData.schoolName.trim(),
        disciplineName: formData.disciplineName.trim(),
        subject: formData.subject.trim(),
        semester: formData.semester.trim(),
        isPrivate: formData.isPrivate,
        filePath: base64Data, // base64 string
        fileName: file.name,
      };

      const result = await uploadNote(noteData);
      
      if (result.success) {
        navigate('/notes');
      }
    } catch (error) {
      console.error('Error converting file:', error);
      toast.error('Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upload Notes</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Share your educational resources with fellow students
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                placeholder="e.g., Data Structures Complete Notes"
              />
              {errors.title && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                placeholder="Briefly describe the content of these notes..."
              />
              {errors.description && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-500">
                {formData.description.length}/2000 characters
              </p>
            </div>

            {/* School Name and Discipline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* School Name */}
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  School/University <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border ${
                    errors.schoolName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="e.g., MIT"
                />
                {errors.schoolName && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.schoolName}
                  </p>
                )}
              </div>

              {/* Discipline Name */}
              <div>
                <label htmlFor="disciplineName" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Discipline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="disciplineName"
                  name="disciplineName"
                  value={formData.disciplineName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border ${
                    errors.disciplineName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="e.g., Computer Science"
                />
                {errors.disciplineName && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.disciplineName}
                  </p>
                )}
              </div>
            </div>

            {/* Subject and Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border ${
                    errors.subject ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="e.g., Operating Systems"
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Semester */}
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Semester <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 sm:py-2 text-sm sm:text-base border ${
                    errors.semester ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="e.g., 3"
                />
                {errors.semester && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.semester}
                  </p>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                PDF File <span className="text-red-500">*</span>
              </label>
              <FileUpload onFileSelect={handleFileSelect} />
              {errors.file && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.file}
                </p>
              )}
            </div>

            {/* Privacy Setting */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isPrivate" className="font-medium text-gray-700">
                    Make this note private
                  </label>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Private notes are only visible to you
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <Loader size="small" /> : 'Upload Notes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/notes')}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
