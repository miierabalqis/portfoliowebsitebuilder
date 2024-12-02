import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getDocs, collection, onSnapshot} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {projectFirestore} from '../../firebase/config';
import {getPublicUrl} from '../../firebase/firebaseStorageUtils';
import {createNewResume} from '../../firebase/helpers';

import {
    HiViewGrid,
    HiDocument,
    HiLightningBolt,
    HiColorSwatch,
} from 'react-icons/hi';

export default function Home() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All Templates');
    const [categories, setCategories] = useState([]);

    const categoryIcons = {
        'All Templates': <HiViewGrid className='w-5 h-5 mr-2' />,
        Simple: <HiDocument className='w-5 h-5 mr-2' />,
        Modern: <HiLightningBolt className='w-5 h-5 mr-2' />,
        Creative: <HiColorSwatch className='w-5 h-5 mr-2' />,
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(projectFirestore, 'templates'),
            async (querySnapshot) => {
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
                                    imageUrl: url || '',
                                    category:
                                        templateData.category ||
                                        'Uncategorized',
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

                try {
                    const resolvedTemplates = await Promise.all(fetchPromises);
                    const validTemplates = resolvedTemplates.filter(Boolean);
                    setTemplates(validTemplates);
                    setFilteredTemplates(validTemplates);
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

        return () => unsubscribe();
    }, []);

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
        <div className='min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900'>
            <section className='flex items-start justify-center min-h-screen text-gray-300 pt-20'>
                <div className='text-center mb-12 sm:mx-auto sm:w-full'>
                    <h2 className='mt-10 text-center text-4xl md:text-5xl font-bold text-white mb-4 hover:text-pink-500 transition-colors duration-300'>
                        Your Dream Resume,{' '}
                        <span className='text-pink-500 hover:text-pink-400 transition-colors duration-300'>
                            Created in an Instant!
                        </span>
                    </h2>
                    <div className='mb-20'>
                        <h1 className='block text-base text-center font-medium text-gray-300 pt-5 hover:text-white transition-colors duration-300'>
                            Select a resume template below to start building
                            your resume
                        </h1>
                    </div>

                    {/* Tabs */}
                    <div className='flex justify-center'>
                        <div className='w-full max-w-4xl border-b border-gray-700'>
                            <ul className='flex flex-wrap -mb-px text-sm font-medium text-center text-gray-400 justify-center'>
                                {categories.map((category) => (
                                    <li key={category} className='me-2'>
                                        <a
                                            href='#'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleTabClick(category);
                                            }}
                                            className={`inline-flex items-center justify-center p-4 text-base border-b-4 border-transparent rounded-t-lg hover:text-purple-400 hover:border-purple-500 group transition-all duration-300 ${
                                                selectedCategory === category
                                                    ? 'border-purple-500 text-purple-400'
                                                    : 'hover:text-purple-400'
                                            }`}
                                        >
                                            {categoryIcons[category]}
                                            <span>{category}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Loading Spinner */}
                    {loading ? (
                        <div className='text-center text-purple-400'>
                            Loading...
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-10 px-4'>
                            {filteredTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className='relative group cursor-pointer'
                                    onClick={() =>
                                        handleTemplateClick(template.id)
                                    }
                                >
                                    <div className='bg-white rounded-xl overflow-hidden shadow-lg border-4 border-purple-500 hover:border-pink-500 transition-all duration-300 hover:-translate-y-2'>
                                        <img
                                            src={template.imageUrl}
                                            alt={template.name}
                                            className='h-96 w-full object-cover object-top transition-all duration-300 ease-in-out group-hover:filter group-hover:brightness-50'
                                        />
                                        <div className='hidden group-hover:block absolute bottom-0 left-0 w-full p-4 bg-black bg-opacity-75'>
                                            <h3 className='text-white text-lg font-semibold mb-2'>
                                                {template.name}
                                            </h3>
                                            <button className='bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-500 transition-colors duration-300 font-semibold'>
                                                Select Template
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
