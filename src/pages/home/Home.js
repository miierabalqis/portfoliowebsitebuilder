import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    doc,
    setDoc,
    getDocs,
    getDoc,
    collection,
    onSnapshot,
} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {projectFirestore} from '../../firebase/config'; // Import Firestore
import {projectFirestore as db} from '../../firebase/config';
import {getPublicUrl} from '../../firebase/firebaseStorageUtils'; // Import utility for public URL
import {serverTimestamp} from 'firebase/firestore';
import {
    createNewResume,
    getUserResumesForTemplate,
} from '../../firebase/helpers';

export default function Home() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [resumeId, setResumeId] = useState(null);
    const [templateId, setTemplateId] = useState(null);
    const [loading, setLoading] = useState(true); // State to track loading
    const [filteredTemplates, setFilteredTemplates] = useState([]); // Filtered templates based on category
    const [selectedCategory, setSelectedCategory] = useState('All Templates'); // Default category
    const [categories, setCategories] = useState([]); // Categories for filtering

    // Fetch templates from Firestore with resolved image URLs
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(projectFirestore, 'templates'),
            async (querySnapshot) => {
                const templatesList = [];
                const fetchPromises = [];

                querySnapshot.forEach((docSnapshot) => {
                    const templateData = docSnapshot.data();
                    const storagePath = templateData.imageUrl;

                    if (storagePath) {
                        fetchPromises.push(
                            getPublicUrl(storagePath)
                                .then((url) => ({
                                    id: docSnapshot.id,
                                    name:
                                        templateData.name || 'Unknown Template',
                                    imageUrl: url || '', // Fallback for missing image
                                    category:
                                        templateData.category ||
                                        'Uncategorized', // Fallback for missing category
                                }))
                                .catch((error) => {
                                    console.error(
                                        `Error fetching public URL for ${storagePath}:`,
                                        error,
                                    );
                                    return null;
                                }),
                        );
                    }
                });

                // Resolve promises and update state
                try {
                    const resolvedTemplates = await Promise.all(fetchPromises);
                    const validTemplates = resolvedTemplates.filter(Boolean); // Remove failed fetches
                    setTemplates(validTemplates);
                    setFilteredTemplates(validTemplates); // Initially show all
                    setLoading(false);
                } catch (error) {
                    console.error('Error resolving templates:', error);
                    setLoading(false);
                }
            },
            (error) => {
                console.error('Error fetching templates:', error);
                setLoading(false);
            },
        );

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Fetch categories for tabs
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(
                    collection(projectFirestore, 'templates'),
                );
                const categoriesSet = new Set(['All Templates']);
                querySnapshot.forEach((doc) => {
                    const templateData = doc.data();
                    if (templateData.category)
                        categoriesSet.add(templateData.category);
                });
                setCategories([...categoriesSet]);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Handle tab click for filtering
    const handleTabClick = (category) => {
        setSelectedCategory(category);
        setFilteredTemplates(
            category === 'All Templates'
                ? templates
                : templates.filter(
                      (template) => template.category === category,
                  ),
        );
    };

    const handleTemplateClick = async (templateId) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            try {
                // Create a new resume document
                const newResumeId = await createNewResume(
                    user.email,
                    templateId,
                );
                navigate(`/form/${templateId}/${newResumeId}`);
                return newResumeId;
            } catch (error) {
                console.error('Error handling template selection:', error);
                return null;
            }
        } else {
            console.error('No user is signed in!');
            return null;
        }
    };

    return (
        <div className='min-h-screen bg-amber-50'>
            <section className='flex items-start justify-center min-h-screen text-gray-600 pt-20'>
                <div className='text-center mb-12 sm:mx-auto sm:w-full'>
                    <h2 className='mt-10 text-center text-5xl font-bold tracking-tight text-gray-900'>
                        Your Dream Resume, Created in an Instant!
                    </h2>
                    <div className='mb-20'>
                        <h1 className='block text-base text-center font-medium text-gray-900 pt-5'>
                            Select a resume template below to start building
                            your resume
                        </h1>
                    </div>

                    {/* Tabs */}
                    <div className='flex justify-center'>
                        <div className='w-full max-w-4xl border-b border-gray-200'>
                            <ul className='flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 justify-center'>
                                {categories.map((category) => (
                                    <li key={category} className='me-2'>
                                        <a
                                            href='#'
                                            onClick={() =>
                                                handleTabClick(category)
                                            }
                                            className={`inline-flex items-center justify-center p-4 text-base border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-sky-500 hover:text-sky-500 group ${
                                                selectedCategory === category
                                                    ? 'border-sky-500 text-sky-500'
                                                    : ''
                                            }`}
                                        >
                                            {category}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Loading Spinner */}
                    {loading ? (
                        <div className='text-center'>Loading...</div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-10'>
                            {filteredTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className='w-full p-2 ml-14'
                                    onClick={() =>
                                        handleTemplateClick(template.id)
                                    }
                                >
                                    <div className='flex flex-col h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden group relative'>
                                        <img
                                            src={template.imageUrl}
                                            alt={template.name}
                                            className='h-74 w-full object-cover object-center transition-all duration-300 ease-in-out'
                                        />
                                        <div className='group-hover:block hidden absolute bottom-0 left-0 w-full h-1/4 bg-black bg-opacity-75'></div>
                                        <div className='group-hover:block hidden absolute bottom-0 left-0 text-white text-base font-semibold py-4 px-4 mb-4'>
                                            {template.name}
                                        </div>
                                        <div className='group-hover:block hidden absolute bottom-0 right-0 bg-purple-600 text-white text-sm py-4 px-4 rounded cursor-pointer mb-5 mr-5'>
                                            <button className='w-full text-center font-semibold'>
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
