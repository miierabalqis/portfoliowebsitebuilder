import {projectAuth} from '../../../../firebase/config';
import {projectFirestore as db} from '../../../../firebase/config';
import {doc, getDoc, setDoc, serverTimestamp} from 'firebase/firestore';

// Default initial resume data structure
export const initialResumeData = {
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
};

// Fetch existing resume data
export const fetchResumeData = async (resumeId) => {
    const user = projectAuth.currentUser;
    if (!user || !resumeId) return null;

    try {
        const docRef = doc(db, 'resumes', resumeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log('No resume data found.');
            return null;
        }
    } catch (err) {
        console.error('Error fetching resume data:', err);
        return null;
    }
};

// Save resume data
export const saveResumeData = async (resumeId, templateId, resumeData) => {
    const user = projectAuth.currentUser;

    if (!user || !templateId || !resumeId) {
        throw new Error('User not logged in or no template selected.');
    }

    const resumeDataWithMetadata = {
        ...resumeData,
        userId: user.uid,
        userEmail: user.email,
        templateId: templateId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    try {
        const docRef = doc(db, 'resumes', resumeId);
        await setDoc(docRef, resumeDataWithMetadata);
        return resumeDataWithMetadata;
    } catch (error) {
        console.error('Error saving resume:', error);
        throw error;
    }
};

// Utility function to update resume data
export const updateResumeData = (
    prevData,
    section,
    field,
    value,
    isArray = false,
) => {
    if (isArray) {
        const updatedArray = [...prevData[section]];
        updatedArray[field] = {...updatedArray[field], value};
        return {
            ...prevData,
            [section]: updatedArray,
        };
    }

    return {
        ...prevData,
        [section]: {...prevData[section], [field]: value},
    };
};

// Function to add a new entry to experience or education
export const addNewEntry = (prevData, section) => {
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

    return {
        ...prevData,
        [section]: [...prevData[section], newEntry],
    };
};

// Function to remove an entry from experience or education
export const removeEntry = (prevData, section, index) => {
    return {
        ...prevData,
        [section]: prevData[section].filter((_, i) => i !== index),
    };
};

// Function to add a skill
export const addSkill = (prevData, skill) => {
    return {
        ...prevData,
        skills: [...prevData.skills, skill.trim()],
    };
};

// Function to remove a skill
export const removeSkill = (prevData, index) => {
    return {
        ...prevData,
        skills: prevData.skills.filter((_, i) => i !== index),
    };
};
