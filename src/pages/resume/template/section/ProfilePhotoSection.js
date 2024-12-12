const ProfilePhotoSection = ({profilePhoto}) => {
    if (!profilePhoto) return null;

    return (
        <div>
            <img
                src={
                    profilePhoto ||
                    './../template_2/assets/default profile image.jpg'
                } // Fallback to default
                alt='Profile'
            />
        </div>
    );
};

export default ProfilePhotoSection;
