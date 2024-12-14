import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faPaintBrush,
    faMobileAlt,
    faCode,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

// At the top of your file, import the template images
import ModernTemplateImage from '../../assets/landing/modern template image.png';
import CreativeTemplateImage from '../../assets/landing/creative template image.png';
import MinimalistTemplateImage from '../../assets/landing/simple template image.jpg';

const App = () => {
    return (
        <div className='min-h-screen bg-[#FBFBFB]'>
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
        <div className='relative'>
            <div className='absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-[#CDC1FF] via-[#BFECFF] to-[#FFCCEA]'></div>
            <h2 className='relative text-4xl md:text-5xl font-bold text-black mb-4 pt-12 hover:scale-105 transition-transform duration-300'>
                Create Your Professional{' '}
                <span className='bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] bg-clip-text text-transparent hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300'>
                    Portfolio
                </span>
            </h2>
        </div>
        <p className='text-gray-600 mb-8 text-lg max-w-2xl mx-auto'>
            Build a stunning portfolio website in minutes with our easy-to-use
            builder.
        </p>
        <a
            href='/home'
            className='group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black px-8 py-4 rounded-full text-lg font-semibold hover:from-[#BFECFF] hover:to-[#FFCCEA] hover:scale-105 transform transition-all duration-300 hover:shadow-lg inline-flex items-center'
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
        <h3 className='text-3xl font-bold text-black mb-8 text-center hover:text-[#CDC1FF] transition-colors duration-300'>
            Powerful Features
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Feature
                icon={faPaintBrush}
                title='Customizable Templates'
                description='Choose and customize from a variety of stunning templates.'
                color='#EB3678'
            />
            <Feature
                icon={faMobileAlt}
                title='Responsive Design'
                description='Looks great on any device: phone, tablet, or desktop.'
                color='#3DC2EC'
            />
            <Feature
                icon={faCode}
                title='Easy to Use'
                description='Realtime Preview of portfolio'
                color='#610C9F'
            />
        </div>
    </section>
);

const Feature = ({icon, title, description, color}) => (
    <div className='group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 hover:-translate-y-2 border border-[#CDC1FF]/10'>
        <div className='flex justify-center'>
            <FontAwesomeIcon
                icon={icon}
                size='3x'
                style={{color}}
                className='mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300'
            />
        </div>
        <h4
            style={{color}}
            className='text-2xl font-bold mb-4 text-center opacity-80 group-hover:opacity-100 transition-all duration-300'
        >
            {title}
        </h4>
        <p className='text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300'>
            {description}
        </p>
    </div>
);

const ResumeTemplates = () => (
    <section className='mt-24'>
        <h3 className='text-3xl font-bold text-black mb-8 text-center hover:text-[#CDC1FF] transition-colors duration-300'>
            Resume Templates
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
                {
                    title: 'Modern Template',
                    description: 'A clean, professional resume template.',
                    image: ModernTemplateImage,
                },
                {
                    title: 'Creative Template',
                    description: 'A vibrant, unique resume template.',
                    image: CreativeTemplateImage,
                },
                {
                    title: 'Minimalist Template',
                    description: 'A simple, minimalist resume template.',
                    image: MinimalistTemplateImage,
                },
            ].map((template, index) => (
                <TemplateCard
                    key={index}
                    title={template.title}
                    description={template.description}
                    image={template.image}
                />
            ))}
        </div>
    </section>
);

const TemplateCard = ({title, description, image}) => (
    <div className='group p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative bg-gradient-to-br from-[#CDC1FF]/30 via-[#BFECFF]/30 to-[#FFCCEA]/30 hover:from-[#CDC1FF]/40 hover:via-[#BFECFF]/40 hover:to-[#FFCCEA]/40'>
        <div className='overflow-hidden rounded-lg mb-6'>
            <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-[#CDC1FF]/20 via-[#BFECFF]/20 to-[#FFCCEA]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                <img
                    src={image}
                    alt={`${title} Example`}
                    className='w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500'
                />
            </div>
        </div>
        <h4 className='text-2xl font-bold text-black mb-3 group-hover:text-[#CDC1FF] transition-colors duration-300'>
            {title}
        </h4>
        <p className='text-gray-600 group-hover:text-gray-700 transition-colors duration-300'>
            {description}
        </p>
        <button className='mt-4 text-[#CDC1FF] font-semibold hover:text-[#BFECFF] transition-colors duration-300 inline-flex items-center'>
            <FontAwesomeIcon className='ml-2 group-hover:translate-x-1 transition-transform duration-300' />
        </button>
    </div>
);

const Footer = () => (
    <footer className='bg-gradient-to-r from-[#CDC1FF]/10 via-[#BFECFF]/10 to-[#FFCCEA]/10 text-black py-8 mt-24 border-t border-[#CDC1FF]/20'>
        <div className='container mx-auto text-center'>
            <p className='hover:text-[#CDC1FF] transition-colors duration-300'>
                &copy; 2024 Portfolio Builder. All rights reserved.
            </p>
        </div>
    </footer>
);

export default App;
