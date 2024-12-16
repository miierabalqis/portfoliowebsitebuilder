//useResumeDashboardForm

import {useState, useCallback, useRef} from 'react';
import {doc, updateDoc} from 'firebase/firestore';
import {projectFirestore} from '../../../firebase/config';
import {getAuth} from 'firebase/auth';

export const useResumeDashboardForm = (initialResumeData, onUpdate) => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [editableData, setEditableData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

    const inputRefs = useRef({});
    const textareaRefs = useRef({});

    // Function to maintain focus after state changes
    const maintainFocus = useCallback(() => {
        const activeElement = document.activeElement;
        if (activeElement) {
            const fieldId = activeElement.dataset.fieldId;
            if (fieldId) {
                setTimeout(() => {
                    const element =
                        inputRefs.current[fieldId] ||
                        textareaRefs.current[fieldId];
                    if (element) {
                        element.focus();
                    }
                }, 0);
            }
        }
    }, []);

    const handleResumeSelect = useCallback((resume) => {
        setSelectedResume(resume);
        setEditableData({
            ...resume,
            skills: Array.isArray(resume.skills) ? resume.skills : [],
            experience: Array.isArray(resume.experience)
                ? resume.experience
                : [],
            educationDetail: Array.isArray(resume.educationDetail)
                ? resume.educationDetail
                : [],
        });
        setCurrentStep(0);
        setIsEditing(false);
    }, []);

    const handleInputChange = useCallback((section, value, index, field) => {
        setEditableData((prev) => {
            const newData = {...prev};

            // Update section or field
            if (section === 'profilePhoto') {
                newData[section] = value;
            } else if (section === 'skills') {
                const skills = [
                    ...(Array.isArray(prev.skills) ? prev.skills : []),
                ];
                if (typeof index === 'number') {
                    skills[index] = value;
                }
                newData.skills = skills;
            } else if (typeof index === 'number' && field) {
                if (!Array.isArray(newData[section])) {
                    newData[section] = [];
                }
                const sectionArray = [...newData[section]];
                if (!sectionArray[index]) {
                    sectionArray[index] = {};
                }
                sectionArray[index] = {
                    ...sectionArray[index],
                    [field]: value,
                };
                newData[section] = sectionArray;
            } else if (field) {
                if (!newData[section]) {
                    newData[section] = {};
                }
                newData[section] = {...newData[section], [field]: value};
            } else {
                newData[section] = value;
            }

            return newData; // Update the state with the new data
        });
    }, []);

    const handleSaveSection = async () => {
        if (!user || !selectedResume) {
            alert('User or resume not found. Please try again.');
            return;
        }
        setIsSaving(true);

        try {
            const sectionKeys = [
                'profilePhoto',
                'personalDetail',
                'summary',
                'experience',
                'educationDetail',
                'skills',
            ];
            const sectionKey = sectionKeys[currentStep];
            const resumeRef = doc(
                projectFirestore,
                'resumes',
                selectedResume.id,
            );

            // Prepare the update data
            let updateData;

            // Get the current section's data from editableData
            const sectionData = editableData[sectionKey];

            // Update only the specific section in Firestore
            updateData = {
                [sectionKey]: sectionData,
            };

            // Update Firestore
            await updateDoc(resumeRef, updateData);

            // Update selectedResume state with the new data
            setSelectedResume((prev) => ({
                ...prev,
                [sectionKey]: sectionData,
            }));

            // Update resumes list with the new data
            setResumes((prev) =>
                prev.map((resume) =>
                    resume.id === selectedResume.id
                        ? {
                              ...resume,
                              [sectionKey]: sectionData,
                          }
                        : resume,
                ),
            );

            alert('Section updated successfully!');
            setIsEditing(false);

            // Add a page refresh after successful save
            window.location.reload();
        } catch (error) {
            console.error('Error saving section:', error);
            alert('Failed to save section. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleNextStep = useCallback(() => {
        if (currentStep < 5) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    }, [currentStep]);

    const handlePreviousStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    }, [currentStep]);

    const addArrayItem = useCallback((section, template) => {
        setEditableData((prev) => ({
            ...prev,
            [section]: [...(prev[section] || []), template],
        }));
    }, []);

    const removeArrayItem = useCallback((section, index) => {
        setEditableData((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
        }));
    }, []);

    return {
        resumes,
        setResumes,
        loading,
        setLoading,
        error,
        setError,
        selectedResume,
        currentStep,
        setCurrentStep,
        editableData,
        setEditableData,
        isEditing,
        setIsEditing,
        isSaving,
        inputRefs,
        textareaRefs,
        handleResumeSelect,
        handleInputChange,
        handleSaveSection,
        handleNextStep,
        handlePreviousStep,
        addArrayItem,
        removeArrayItem,
    };
};
