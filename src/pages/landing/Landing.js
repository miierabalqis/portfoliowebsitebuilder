import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faPaintBrush,
    faMobileAlt,
    faCode,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

const App = () => {
    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900'>
            <Main />
            <Footer />
        </div>
    );
};

const Main = () => (
    <main className='container mx-auto px-4 py-16'>
        <Hero />
        <Features />
        <ResumeTemplates />
    </main>
);

const Hero = () => (
    <section className='text-center'>
        <h2 className='text-4xl md:text-5xl font-bold text-white mb-4 pt-12 hover:scale-105 transition-transform duration-300'>
            Create Your Professional{' '}
            <span className='text-pink-500 hover:text-pink-400 transition-colors duration-300'>
                Portfolio
            </span>
        </h2>
        <p className='text-gray-300 mb-8 text-lg max-w-2xl mx-auto'>
            Build a stunning portfolio website in minutes with our easy-to-use
            builder.
        </p>
        <a
            href='/home'
            className='group bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-500 hover:scale-105 transform transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 inline-flex items-center'
        >
            Get Started
            <FontAwesomeIcon
                icon={faArrowRight}
                className='ml-2 group-hover:translate-x-1 transition-transform duration-300'
            />
        </a>
    </section>
);

const Features = () => (
    <section className='mt-24'>
        <h3 className='text-3xl font-bold text-white mb-8 text-center hover:text-pink-500 transition-colors duration-300'>
            Powerful Features
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Feature
                icon={faPaintBrush}
                title='Customizable Templates'
                description='Choose and customize from a variety of stunning templates.'
            />
            <Feature
                icon={faMobileAlt}
                title='Responsive Design'
                description='Looks great on any device: phone, tablet, or desktop.'
            />
            <Feature
                icon={faCode}
                title='Easy to Use'
                description='No coding required; just drag and drop.'
            />
        </div>
    </section>
);

const Feature = ({icon, title, description}) => (
    <div className='group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2'>
        <div className='flex justify-center'>
            <FontAwesomeIcon
                icon={icon}
                size='3x'
                className='text-purple-600 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300'
            />
        </div>
        <h4 className='text-2xl font-bold text-gray-800 mb-4 text-center group-hover:text-purple-600 transition-colors duration-300'>
            {title}
        </h4>
        <p className='text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300'>
            {description}
        </p>
    </div>
);

const ResumeTemplates = () => (
    <section className='mt-24'>
        <h3 className='text-3xl font-bold text-white mb-8 text-center hover:text-pink-500 transition-colors duration-300'>
            Resume Templates
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {['Modern', 'Creative', 'Minimalist'].map((template, index) => (
                <TemplateCard
                    key={index}
                    title={`${template} Template`}
                    description={`A ${template.toLowerCase()} resume template with ${
                        template === 'Modern'
                            ? 'clean, professional'
                            : template === 'Creative'
                            ? 'vibrant, unique'
                            : 'simple, minimalist'
                    } design.`}
                />
            ))}
        </div>
    </section>
);

const TemplateCard = ({title, description}) => (
    <div className='group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2'>
        <div className='overflow-hidden rounded-lg mb-6'>
            <img
                src='/api/placeholder/300/200'
                alt={`${title} Example`}
                className='w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500'
            />
        </div>
        <h4 className='text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300'>
            {title}
        </h4>
        <p className='text-gray-600 group-hover:text-gray-700 transition-colors duration-300'>
            {description}
        </p>
        <button className='mt-4 text-purple-600 font-semibold hover:text-purple-500 transition-colors duration-300 inline-flex items-center'>
            Preview Template
            <FontAwesomeIcon
                icon={faArrowRight}
                className='ml-2 group-hover:translate-x-1 transition-transform duration-300'
            />
        </button>
    </div>
);

const Footer = () => (
    <footer className='bg-gray-900 text-white py-8 mt-24 border-t border-gray-800'>
        <div className='container mx-auto text-center'>
            <p className='hover:text-purple-400 transition-colors duration-300'>
                &copy; 2024 Portfolio Builder. All rights reserved.
            </p>
        </div>
    </footer>
);

export default App;
