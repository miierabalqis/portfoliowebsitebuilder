// components/sections/SkillsSection.js
const SkillsSection = ({skills}) => {
    if (!skills?.length) return null;

    return (
        <div>
            <div>
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm'
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SkillsSection;
