import {useState, useEffect} from 'react';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {
    projectFirestore as db,
    projectAuth,
} from '../../../../../../src/firebase/config';
import {serverTimestamp} from 'firebase/firestore';

export const useResumeForm = ({
    templateId,
    resumeId,
    initialData,
    onUpdate,
}) => {
    const [saveStatus, setSaveStatus] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const [resumeData, setResumeData] = useState({
        profilePhoto: null,
        personalDetail: {
            name: '',
            email: '',
            phone: '',
            address: '',
        },
        summary: '',
        experience: [
            {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ],
        educationDetail: [
            {
                level: '',
                institution: '',
                course: '',
                result: '',
                startDate: '',
                endDate: '',
            },
        ],
        skills: [],
    });

    // Initialize data from initialData
    useEffect(() => {
        if (initialData) {
            setResumeData((prevData) => ({...prevData, ...initialData}));
        }
    }, [initialData]);

    // Fetch resume data from Firestore
    useEffect(() => {
        const fetchResumeData = async () => {
            const user = projectAuth.currentUser;
            if (!user || !templateId) return;

            try {
                const docRef = doc(db, 'resumes', resumeId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setResumeData((prev) => ({...prev, ...data}));

                    // Call onUpdate only if it exists and is not causing an infinite loop
                    if (onUpdate) {
                        onUpdate(data);
                    }
                } else {
                    console.log('No resume data found.');
                }
            } catch (err) {
                console.error('Error fetching resume data:', err);
                setError('Failed to fetch resume data.');
            }
        };

        fetchResumeData();
    }, [templateId, resumeId]);

    const setProfilePhoto = (url) => {
        const updatedData = {
            ...resumeData,
            profilePhoto: url,
        };
        setResumeData(updatedData);
        onUpdate && onUpdate(updatedData);
    };

    // Function to handle input change
    const handleInputChange = (section, field, value) => {
        setResumeData((prev) => {
            if (section === null || section === 'summary') {
                // Direct update for 'summary' or null fields
                return {...prev, [field]: value};
            }
            // Nested field update (e.g., personalDetail.name)
            return {
                ...prev,
                [section]: {...prev[section], [field]: value},
            };
        });

        if (onUpdate) {
            onUpdate(resumeData);
        }
    };

    const handleArrayChange = (section, index, field, value) => {
        setResumeData((prev) => {
            const updatedArray = [...prev[section]];
            updatedArray[index] = {...updatedArray[index], [field]: value};
            return {...prev, [section]: updatedArray};
        });

        if (onUpdate) {
            onUpdate(resumeData);
        }
    };

    const addEntry = (section) => {
        const newEntry =
            section === 'experience'
                ? {
                      company: '',
                      position: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                  }
                : {
                      level: '',
                      institution: '',
                      course: '',
                      result: '',
                      startDate: '',
                      endDate: '',
                  };

        setResumeData((prev) => ({
            ...prev,
            [section]: [...prev[section], newEntry],
        }));
    };

    const removeEntry = (section, index) => {
        const updatedData = {
            ...resumeData,
            [section]: resumeData[section].filter((_, i) => i !== index),
        };
        setResumeData(updatedData);
        onUpdate && onUpdate(updatedData);
    };

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = projectAuth.currentUser;

        if (!user || !templateId || !resumeId) {
            setSaveStatus('error');
            setError('User not logged in or no template selected.');
            return;
        }

        setIsUploading(true);
        setSaveStatus('saving');

        try {
            const docRef = doc(db, 'resumes', resumeId);
            const resumeDataWithMetadata = {
                ...resumeData,
                userId: user.uid,
                userEmail: user.email,
                templateId: templateId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(docRef, resumeDataWithMetadata);
            setSaveStatus('success');
            if (onUpdate) {
                onUpdate(resumeDataWithMetadata);
            }
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error('Error saving resume:', error);
            setSaveStatus('error');
            setError('Failed to save resume.');
        } finally {
            setIsUploading(false);
        }
    };

    const addSkill = (skill) => {
        if (skill.trim()) {
            setResumeData((prev) => ({
                ...prev,
                skills: [...prev.skills, skill.trim()],
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (index) => {
        const updatedSkills = resumeData.skills.filter((_, i) => i !== index);
        setResumeData((prev) => ({
            ...prev,
            skills: updatedSkills,
        }));
    };

    return {
        resumeData,
        currentStep,
        isUploading,
        saveStatus,
        error,
        newSkill,
        setNewSkill,
        setProfilePhoto,
        handleInputChange,
        handleArrayChange,
        addEntry,
        removeEntry,
        handleNext,
        handlePrevious,
        handleSubmit,
        addSkill,
        removeSkill,
        setCurrentStep,
    };
};
