const EmailSection = ({personalDetail}) => {
    return (
        <div>
            <div>
                <h1>{personalDetail?.email}</h1>
            </div>
        </div>
    );
};

export default EmailSection;
