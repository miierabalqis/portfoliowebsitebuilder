import {
    collection,
    doc,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import {projectFirestore} from '../firebase/config';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';

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
 * @param {string} resumeId - The ID of the selected template.
 * @returns {Object|null} - The fetched resume data or null if not found.
 */
export const fetchResumeData = async (userEmail, resumeId) => {
    try {
        // Construct the reference using Firebase v9 syntax
        const resumeRef = doc(
            projectFirestore,
            'resumes',
            resumeId,
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

export const fetchUserResumesWithTemplates = async (userId) => {
    try {
        if (!userId) {
            console.log('No user ID provided');
            return [];
        }

        const storage = getStorage();

        const resumesQuery = query(
            collection(projectFirestore, 'resumes'),
            where('userId', '==', userId),
        );
        const resumeSnapshot = await getDocs(resumesQuery);

        console.log('Resume Snapshot Size:', resumeSnapshot.size);
        if (resumeSnapshot.empty) {
            console.log('No resume data found for this user.');
            return [];
        }

        const resumeData = [];
        for (const docSnap of resumeSnapshot.docs) {
            const resume = docSnap.data();
            const templateDoc = await getDoc(
                doc(projectFirestore, 'templates', resume.templateId),
            );

            if (templateDoc.exists()) {
                try {
                    // Convert Firebase Storage URL to downloadable URL
                    const imageRef = ref(storage, templateDoc.data().imageUrl);
                    const imageUrl = await getDownloadURL(imageRef);

                    resumeData.push({
                        id: docSnap.id,
                        templateName: templateDoc.data().name,
                        imageUrl: imageUrl, // Use the downloadable URL
                        createdAt: resume.createdAt,
                        resumeName: resume.resumeName || 'Untitled',
                        templateId: resume.templateId,
                        editName: resume.editName || '',
                    });
                } catch (imageError) {
                    console.error(
                        'Error getting image download URL:',
                        imageError,
                    );
                }
            } else {
                console.log(
                    `No template found for templateId: ${resume.templateId}`,
                );
            }
        }
        return resumeData;
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return [];
    }
};

// Function to save the resume name in Firebase
export const saveResumeEditName = async (resumeId, newName) => {
    const resumeRef = doc(projectFirestore, 'resumes', resumeId);
    try {
        await updateDoc(resumeRef, {
            editName: newName, // Save the new name to the field `editName`
        });
    } catch (err) {
        console.error('Error updating resume name:', err);
        throw new Error('Failed to update name');
    }
};

export async function updateResumeEditName(userId, resumeId, newEditName) {
    try {
        const resumeRef = doc(
            projectFirestore,
            'resumes',
            resumeId,
            'userEmail',
            userId,
        );
        await updateDoc(resumeRef, {
            editName: newEditName,
        });
        console.log('Resume editName updated successfully');
    } catch (error) {
        console.error('Error updating editName:', error);
        throw new Error('Failed to update editName');
    }
}

//From Dashboard
/**
 * Fetch resumes with template images and detailed arrays for a specific user.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Array} - List of resumes with detailed information and template images.
 */
export const fetchUserResumesWithTemplatesForm = async (userId) => {
    try {
        if (!userId) {
            console.log('No user ID provided');
            return [];
        }

        const storage = getStorage();

        const resumesQuery = query(
            collection(projectFirestore, 'resumes'),
            where('userId', '==', userId),
        );
        const resumeSnapshot = await getDocs(resumesQuery);

        console.log('Resume Snapshot Size:', resumeSnapshot.size);
        if (resumeSnapshot.empty) {
            console.log('No resume data found for this user.');
            return [];
        }

        const resumeData = [];
        for (const docSnap of resumeSnapshot.docs) {
            const resume = docSnap.data();
            const templateDoc = await getDoc(
                doc(projectFirestore, 'templates', resume.templateId),
            );

            if (templateDoc.exists()) {
                try {
                    // Convert Firebase Storage URL to downloadable URL
                    const imageRef = ref(storage, templateDoc.data().imageUrl);
                    const imageUrl = await getDownloadURL(imageRef);

                    resumeData.push({
                        id: docSnap.id,
                        templateName: templateDoc.data().name,
                        imageUrl: imageUrl, // Use the downloadable URL
                        createdAt: resume.createdAt,
                        resumeName: resume.editName || 'Untitled',
                        templateId: resume.templateId,
                        editName: resume.editName || '',
                        personalDetail: resume.personalDetail || {}, // Map with personal details
                        educationDetail: resume.educationDetail || [], // Array of education details
                        experience: resume.experience || [], // Array of experience
                        skills: resume.skills || [], // Array of skills
                        summary: resume.summary || '',
                    });
                } catch (imageError) {
                    console.error(
                        'Error getting image download URL:',
                        imageError,
                    );
                }
            } else {
                console.log(
                    `No template found for templateId: ${resume.templateId}`,
                );
            }
        }
        return resumeData;
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return [];
    }
};

// //Update fields in resumeDashboardForm
export const updateResumeSection = async (
    userId,
    resumeId,
    sectionName,
    sectionData,
) => {
    try {
        const resumeDocRef = doc(
            projectFirestore,
            'users',
            userId,
            'resumes',
            resumeId,
        );

        await updateDoc(resumeDocRef, {
            [`${sectionName}`]: sectionData,
        });

        return true;
    } catch (error) {
        console.error(`Error updating ${sectionName} section:`, error);
        return false;
    }
};

export const updateProfilePhoto = async (userId, resumeId, photoUrl) => {
    try {
        const resumeDocRef = doc(
            projectFirestore,
            'users',
            userId,
            'resumes',
            resumeId,
        );

        await updateDoc(resumeDocRef, {
            profilePhoto: photoUrl,
        });

        return true;
    } catch (error) {
        console.error('Error updating profile photo:', error);
        return false;
    }
};

export const fetchResumeByTemplateId = async (userId, templateId) => {
    try {
        if (!userId || !templateId) {
            console.log('Missing userId or templateId');
            return null;
        }

        // Query resumes collection for the specific template and user
        const resumesRef = collection(projectFirestore, 'resumes');
        const q = query(
            resumesRef,
            where('userId', '==', userId),
            where('templateId', '==', templateId),
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('No resume found for this template');
            return null;
        }

        // Get the first matching resume
        const resumeDoc = querySnapshot.docs[0];
        const resumeData = resumeDoc.data();

        // Get the template details
        const templateDoc = await getDoc(
            doc(projectFirestore, 'templates', templateId),
        );

        if (templateDoc.exists()) {
            // Return the same structure as fetchUserResumesWithTemplatesForm
            return {
                id: resumeDoc.id,
                templateName: templateDoc.data().name,
                createdAt: resumeData.createdAt,
                resumeName: resumeData.editName || 'Untitled',
                templateId: resumeData.templateId,
                editName: resumeData.editName || '',
                personalDetail: resumeData.personalDetail || {
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                },
                educationDetail: resumeData.educationDetail || [],
                experience: resumeData.experience || [],
                skills: resumeData.skills || [],
                summary: resumeData.summary || '',
            };
        } else {
            console.log('Template not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching resume:', error);
        throw error;
    }
};
