import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import ResumeForm from '../resume/edit/ResumeForm';

function Form() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle click outside to close the sidebar
  const sidebarRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) &&
          formRef.current && !formRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar Section */}
        <div ref={sidebarRef} className="bg-orange-300 dark:bg-orange-900 min-h-screen">
            <Sidebar />
        </div>

        {/* Main Form Section */}
        <div className="flex-1 bg-white dark:bg-gray-900 pl-28">
            <ResumeForm />
        </div>
    </div>
  );
}

export default Form;