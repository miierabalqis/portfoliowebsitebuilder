const Skills = ({skills, setResumeData}) => {
    const handleAddSkill = (e, newSkill, setResumeData) => {
        e.preventDefault();
        if (newSkill.trim()) {
            setResumeData((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
        }
    };

    const handleRemoveSkill = (index, setResumeData) => {
        setResumeData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    return {handleAddSkill, handleRemoveSkill};
};

export default Skills;
