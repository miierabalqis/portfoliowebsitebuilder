import {
    collection,
    doc,
    setDoc,
    getDoc,
    addDoc,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import {projectFirestore} from '../firebase/config';

/**
 * Save resume data for a specific user and template.
 *
 * @param {Object} resumeData - The data to save for the resume.
 * @param {string} userEmail - The email of the user.
 * @param {string} templateId - The ID of the selected template.
 */
export const saveResumeData = async (resumeData, userEmail, templateId) => {
    try {
        // Reference the document structure as described: resumes -> templateId -> userEmail
        const resumeRef = doc(
            projectFirestore,
            'resumes',
            templateId,
            'userEmail',
            userEmail,
        );

        // Save the resume data
        await setDoc(resumeRef, resumeData, {merge: true});

        console.log('Resume data saved successfully!');
    } catch (error) {
        console.error('Error saving resume data: ', error);
    }
};

/**
 * Fetch resume data for a specific user and template.
 *
 * @param {string} userEmail - The email of the user.
 * @param {string} templateId - The ID of the selected template.
 * @returns {Object|null} - The fetched resume data or null if not found.
 */
export const fetchResumeData = async (userEmail, templateId) => {
    try {
        // Construct the reference using Firebase v9 syntax
        const resumeRef = doc(
            projectFirestore,
            'resumes',
            templateId,
            'userEmail',
            userEmail,
        );

        const resumeDoc = await getDoc(resumeRef);

        if (resumeDoc.exists()) {
            return resumeDoc.data();
        } else {
            console.warn('No resume data found for this user and template.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching resume data:', error);
        throw error;
    }
};

export const createNewResume = async (userId, templateId) => {
    try {
        const resumeRef = await addDoc(
            collection(projectFirestore, 'resumes'),
            {
                userId,
                templateId,
                createdAt: new Date(),
                // You can add more initial fields if needed
            },
        );
        return resumeRef.id;
    } catch (error) {
        console.error('Error creating new resume:', error);
        throw error;
    }
};

export const getUserResumesForTemplate = async (userId, templateId) => {
    try {
        const q = query(
            collection(projectFirestore, 'resumes'),
            where('userId', '==', userId),
            where('templateId', '==', templateId),
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error fetching user resumes:', error);
        throw error;
    }
};

/**
 * Fetch resumes with template images for a specific user.
 *
 * @param {string} userEmail - The email of the user.
 * @returns {Array} - List of resumes with template images.
 */

export const fetchUserResumesWithTemplates = async (userEmail) => {
    try {
        const resumesQuery = query(
            collection(projectFirestore, 'resumes'),
            where('userEmail', '==', userEmail),
        );

        const querySnapshot = await getDocs(resumesQuery);
        const resumes = [];

        for (const docSnapshot of querySnapshot.docs) {
            const resumeData = docSnapshot.data();
            const templateDoc = await getDoc(
                doc(projectFirestore, 'templates', resumeData.templateId),
            );

            if (templateDoc.exists()) {
                resumes.push({
                    id: docSnapshot.id,
                    ...resumeData,
                    imageUrl: templateDoc.data().imageUrl,
                    templateName: templateDoc.data().name,
                });
            }
        }

        return resumes;
    } catch (error) {
        console.error('Error fetching resumes with templates:', error);
        throw error;
    }
};
