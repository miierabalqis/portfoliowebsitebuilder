import {useState, useEffect, useCallback, useRef} from 'react';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import {projectFirestore, projectAuth} from '../../../../../firebase/config';
import {serverTimestamp} from 'firebase/firestore';

export const useUnifiedResumeForm = ({
    mode,
    templateId,
    resumeId,
    initialData,
}) => {
    const [resumeData, setResumeData] = useState(
        initialData || {
            profilePhoto: null,
            personalDetail: {
                name: '',
                email: '',
                phone: '',
                address: '',
            },
            summary: '',
            experience: [],
            educationDetail: [],
            skills: [],
        },
    );
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const user = projectAuth.currentUser;

    const inputRefs = useRef({});
    const textareaRefs = useRef({});

    // Fetch initial data for edit mode
    useEffect(() => {
        if (mode === 'edit' && resumeId) {
            const fetchResume = async () => {
                try {
                    const docRef = doc(projectFirestore, 'resumes', resumeId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setResumeData(docSnap.data());
                    } else {
                        console.error('Resume not found.');
                    }
                } catch (err) {
                    console.error('Error fetching resume:', err);
                    setError('Failed to fetch resume data.');
                }
            };
            fetchResume();
        }
    }, [mode, resumeId]);

    // Handle input changes
    const handleInputChange = useCallback((section, field, value, index) => {
        setResumeData((prev) => {
            const updatedData = {...prev};
            if (index !== undefined) {
                updatedData[section][index] = {
                    ...updatedData[section][index],
                    [field]: value,
                };
            } else if (section) {
                updatedData[section] = {
                    ...updatedData[section],
                    [field]: value,
                };
            } else {
                updatedData[field] = value;
            }
            return updatedData;
        });
    }, []);

    const addArrayItem = useCallback((section, template) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: [...(prev[section] || []), template],
        }));
    }, []);

    const removeArrayItem = useCallback((section, index) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
        }));
    }, []);

    // Save section or full data
    const saveData = async (section) => {
        if (!user || !templateId || !resumeId) {
            setError('Missing required data.');
            return;
        }

        setIsSaving(true);

        try {
            const docRef = doc(projectFirestore, 'resumes', resumeId);
            const dataToSave = section
                ? {[section]: resumeData[section]}
                : resumeData;
            const metadata = {
                ...dataToSave,
                userId: user.uid,
                userEmail: user.email,
                templateId,
                updatedAt: serverTimestamp(),
            };
            if (mode === 'edit') {
                await updateDoc(docRef, metadata);
            } else {
                await setDoc(docRef, metadata);
            }
            setError(null);
        } catch (err) {
            console.error('Error saving data:', err);
            setError('Failed to save data.');
        } finally {
            setIsSaving(false);
        }
    };

    // Step navigation
    const handleNext = useCallback(() => {
        if (currentStep < 5) setCurrentStep((prev) => prev + 1);
    }, [currentStep]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    }, [currentStep]);

    return {
        resumeData,
        currentStep,
        isSaving,
        error,
        handleInputChange,
        addArrayItem,
        removeArrayItem,
        saveData,
        handleNext,
        handlePrevious,
    };
};
