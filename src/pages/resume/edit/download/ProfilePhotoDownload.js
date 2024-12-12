import React, {useState, useEffect} from 'react';

const ProfileImage = ({src}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (src && src.includes('firebasestorage.googleapis.com')) {
            fetch(src)
                .then((response) => response.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImgSrc(reader.result);
                        setIsLoaded(true);
                    };
                    reader.readAsDataURL(blob);
                })
                .catch((error) => {
                    console.error('Error converting image:', error);
                });
        }
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt='Profile'
            crossOrigin='anonymous'
            className='w-full h-full object-cover'
            style={{display: isLoaded ? 'block' : 'none'}}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
                console.error('Image load error:', e);
                setIsLoaded(true);
            }}
        />
    );
};

export default ProfileImage;
