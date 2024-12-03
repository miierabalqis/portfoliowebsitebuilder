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
        'All Templates': <HiViewGrid className='w-5 h-5' />,
        Simple: <HiDocument className='w-5 h-5' />,
        Modern: <HiLightningBolt className='w-5 h-5' />,
        Creative: <HiColorSwatch className='w-5 h-5' />,
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
        <div className='min-h-screen bg-[#FBFBFB]'>
            <div className='container mx-auto px-4 py-16'>
                {/* Header Section */}
                <section className='text-center mb-16'>
                    <div className='relative'>
                        <div className='absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-[#CDC1FF] via-[#BFECFF] to-[#FFCCEA]'></div>
                        <h2 className='relative text-4xl md:text-5xl font-bold text-black mb-4 pt-12 hover:scale-105 transition-transform duration-300'>
                            Your Dream Resume,{' '}
                            <span className='bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] bg-clip-text text-transparent hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300'>
                                Created in an Instant!
                            </span>
                        </h2>
                    </div>
                    <p className='text-gray-600 mb-8 text-lg max-w-2xl mx-auto'>
                        Select a resume template below to start building your
                        professional resume
                    </p>
                </section>

                {/* Categories/Tabs */}
                <div className='flex justify-center mb-12'>
                    <div className='inline-flex gap-4'>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleTabClick(category)}
                                className={`group relative px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                                    selectedCategory === category
                                        ? 'text-[#CDC1FF] bg-white shadow-lg'
                                        : 'text-gray-600 hover:text-[#CDC1FF]'
                                }`}
                            >
                                <span className='transform transition-transform duration-300 group-hover:scale-110'>
                                    {categoryIcons[category]}
                                </span>
                                <span className='font-semibold'>
                                    {category}
                                </span>
                                {selectedCategory === category && (
                                    <div className='absolute inset-0 border border-[#CDC1FF] rounded-full'></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                {loading ? (
                    <div className='text-center py-12'>
                        <div className='animate-pulse text-[#CDC1FF] text-lg'>
                            Loading templates...
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => handleTemplateClick(template.id)}
                                className='group bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 hover:-translate-y-2 border border-[#CDC1FF]/10 overflow-hidden cursor-pointer'
                            >
                                <div className='relative overflow-hidden'>
                                    <img
                                        src={template.imageUrl}
                                        alt={template.name}
                                        className='w-full h-96 object-cover object-top transition-transform duration-500 group-hover:scale-105'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-50 transition-opacity duration-300'></div>
                                    <div className='absolute inset-0 flex flex-col items-center justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                        <h3 className='text-black font-semibold text-xl font-bold mb-4'>
                                            {template.name}
                                        </h3>
                                        <button className='bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-8 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transform transition-all duration-300 hover:scale-105'>
                                            Use This Template
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
