import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {projectFirestore} from '../../firebase/config'; // Import Firestore
import {collection, onSnapshot} from 'firebase/firestore'; // Firestore real-time listener

export default function Home() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status

    // Fetch templates from Firestore in real-time
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(projectFirestore, 'templates'), // Listen to the 'templates' collection
            (querySnapshot) => {
                const templatesList = [];

                // Loop through each template document
                querySnapshot.forEach((docSnapshot) => {
                    // For each template document, get the data
                    const templateData = docSnapshot.data();

                    // Make sure 'imageUrl' field exists
                    const imageUrl =
                        templateData.imageUrl ||
                        '/path-to-placeholder-image.jpg'; // Default placeholder if not found

                    // Store the template data (including imageUrl)
                    templatesList.push({
                        id: docSnapshot.id,
                        name: templateData.name || 'Unknown Template', // Assuming there's a 'name' field as well
                        imageUrl: imageUrl,
                    });
                });

                // Update state with the fetched templates
                setTemplates(templatesList);
                setLoading(false); // Stop loading when done
            },
            (error) => {
                console.error('Error fetching templates: ', error);
                setLoading(false);
            },
        );

        // Clean up listener when component unmounts
        return () => unsubscribe();
    }, []); // This effect runs only once when the component mounts

    const handleEditClick = () => {
        navigate('/edit'); // Navigate to the EditForm page
    };

    return (
        <div className='min-h-screen bg-gray-100'>
            {/* Add padding-top to account for fixed navbar */}
            <section className='flex items-start justify-center min-h-screen text-gray-600 pt-16'>
                <div className='text-center mb-12 sm:mx-auto sm:w-full'>
                    <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>
                        Your Dream Resume, Created in an Instant!
                    </h2>
                    <div className='mb-20'>
                        <h1 className='block text-sm text-center font-medium text-gray-900'>
                            Select a resume template below to start building
                            your resume
                        </h1>
                    </div>

                    {/* Conditionally show a loading spinner while templates are being fetched */}
                    {loading ? (
                        <div className='text-center'>Loading...</div>
                    ) : (
                        // Adjust the layout size displayed
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className='w-full p-2 ml-14'
                                    onClick={handleEditClick} // Navigate to the edit page when clicked
                                >
                                    <div className='flex flex-col h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden group relative'>
                                        {/* Image */}
                                        <img
                                            src={template.imageUrl} // Display the imageUrl from Firestore
                                            alt={template.name}
                                            className='h-74 w-full object-cover object-center transition-all duration-300 ease-in-out'
                                        />

                                        {/* Dark overlay for the bottom part of the image */}
                                        <div className='group-hover:block hidden absolute bottom-0 left-0 w-full h-1/4 bg-black bg-opacity-75'></div>

                                        {/* Template name on hover */}
                                        <div className='group-hover:block hidden absolute bottom-0 left-0 text-white text-base font-semibold py-4 px-4 mb-4'>
                                            {template.name ||
                                                'Unknown Template'}
                                        </div>

                                        {/* Select button at the bottom right */}
                                        <div className='group-hover:block hidden absolute bottom-0 right-0 bg-purple-600 text-white text-sm py-4 px-4 rounded cursor-pointer mb-5 mr-5'>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent the card click from firing
                                                    handleEditClick();
                                                }}
                                                className='w-full text-center font-semibold'
                                            >
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
