import {getStorage, ref, getDownloadURL} from 'firebase/storage';

/**
 * Fetches the public URL for a file in Firebase Storage
 * @param {string} storagePath - The storage path of the file (e.g., "templates/resume2.jpg").
 * @returns {Promise<string>} - A promise that resolves to the public URL of the file.
 */
export const getPublicUrl = (storagePath) => {
    const storage = getStorage(); // Initialize Firebase Storage
    const fileRef = ref(storage, storagePath);

    return getDownloadURL(fileRef)
        .then((url) => url) // Return the public URL
        .catch((error) => {
            console.error(
                `Error fetching public URL for ${storagePath}:`,
                error,
            );
            throw error; // Re-throw error to handle it at the call site
        });
};
