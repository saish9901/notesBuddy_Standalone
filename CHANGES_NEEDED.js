// Script to update Upload.jsx for localStorage with base64 PDF
// This file shows the changes needed

// In handleSubmit function, replace FormData approach with base64:

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
