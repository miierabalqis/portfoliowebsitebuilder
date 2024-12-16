// components/sections/SkillsSection.js
const SkillsSection = ({skills}) => {
    if (!skills?.length) return null;

    return (
        <div>
            <div>
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className='bg-gray-100 font-semibold text-gray-700 px-4 py-1 rounded-full text-sm mr-5 mt-5'
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SkillsSection;
