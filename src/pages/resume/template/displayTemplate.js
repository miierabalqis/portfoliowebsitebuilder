import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {projectFirestore} from '../../../firebase/config';
import InpTemp from './template_1/InpTemp';

const DisplayTemplate = () => {
    const {templateId} = useParams(); // Retrieve templateId from the URL
    const [template, setTemplate] = useState(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const templateRef = doc(
                    projectFirestore,
                    'templates',
                    templateId,
                );
                const docSnap = await getDoc(templateRef);

                if (docSnap.exists()) {
                    setTemplate({id: docSnap.id, ...docSnap.data()});
                } else {
                    console.log('No such template!');
                }
            } catch (error) {
                console.error('Error fetching template:', error);
            }
        };

        fetchTemplate();
    }, [templateId]);

    if (!template) {
        return <div>Loading template...</div>;
    }

    // Design (styling) from the template
    const designStyles = {
        backgroundColor: template.design.backgroundColor || '#fff', // Default color if not found
        color: template.design.textColor || '#000', // Default text color if not found
        fontFamily: template.design.fontFamily || 'Arial', // Default font family if not found
        padding: '20px', // Padding for the overall layout
        borderRadius:
            template.design.shapes?.headerStyle === 'rounded' ? '10px' : '0',
        boxShadow: template.design.shapes?.boxShadow || 'none',
        position: 'relative', // Make sure InpTemp can sit above this layer
    };

    // Ensure InpTemp is styled appropriately to sit above the background layer
    const inpTempStyles = {
        position: 'relative', // Make InpTemp sit on top of the background styles
        zIndex: 2, // Ensure it's above the background
    };

    return (
        <div style={designStyles}>
            {/* Apply InpTemp component with styles on top of the design */}
            <div style={inpTempStyles}>
                <InpTemp resumeData={template.data} />
            </div>
        </div>
    );
};

export default DisplayTemplate;
