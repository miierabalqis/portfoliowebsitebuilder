// components/sections/SummarySection.js
const SummarySection = ({summary}) => {
    if (!summary) return null;

    return (
        <div>
            <p>{summary}</p>
        </div>
    );
};

export default SummarySection;
