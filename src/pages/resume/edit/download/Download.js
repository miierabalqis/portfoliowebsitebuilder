import {doc, getDoc} from 'firebase/firestore';
import {projectFirestore} from '../../../../firebase/config';
import {getAuth} from 'firebase/auth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads a resume as a PDF
 * @param {Object} params - Parameters for resume download
 * @param {Object} params.resume - Resume object containing ID
 * @param {React.RefObject} params.resumeRef - React ref to the resume template DOM element
 * @returns {Promise<{success: boolean, error?: string}>} Download result
 */
export const downloadResumePDF = async ({resume, resumeRef}) => {
    try {
        console.log('Download function called with:', {resume, resumeRef});

        // Validate inputs
        if (!resume) {
            console.error('No resume data provided');
            return {success: false, error: 'No resume data available'};
        }

        if (!resumeRef || !resumeRef.current) {
            console.error('Invalid or missing resume ref');
            return {success: false, error: 'Unable to capture resume preview'};
        }

        // Store original styles
        const element = resumeRef.current;
        const originalStyles = {
            position: element.style.position,
            visibility: element.style.visibility,
            display: element.style.display,
            zIndex: element.style.zIndex,
        };

        // Make element visible for capture
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.visibility = 'visible';
        element.style.display = 'block';
        element.style.zIndex = '-9999';
        element.style.backgroundColor = 'white';

        // Wait a moment for styles to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Attempt to capture the element
        const canvas = await html2canvas(element, {
            scale: 3, // Higher scale for better quality
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff',
            allowTaint: true,
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: 794, // Standard A4 width in pixels
            windowHeight: 1123, // Standard A4 height in pixels
            foreignObjectRendering: true,
        });

        // Restore original styles
        Object.assign(element.style, originalStyles);

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');

        // // Get A4 dimensions
        // const pageWidth = 210;
        // const pageHeight = 297;

        // // Calculate image dimensions to fit the page
        // const imageAspectRatio = canvas.width / canvas.height;
        // let imgWidth = pageWidth;
        // let imgHeight = pageWidth / imageAspectRatio;

        // // Adjust if image is too tall
        // if (imgHeight > pageHeight) {
        //     imgHeight = pageHeight;
        //     imgWidth = pageHeight * imageAspectRatio;
        // }

        // Calculate dimensions more precisely
        const pageWidth = 210;
        const pageHeight = 297;
        const imageAspectRatio = canvas.width / canvas.height;

        let imgWidth, imgHeight;
        if (canvas.height / canvas.width > pageHeight / pageWidth) {
            // Image is taller relative to A4
            imgHeight = pageHeight;
            imgWidth = pageHeight * (canvas.width / canvas.height);
        } else {
            // Image is wider relative to A4
            imgWidth = pageWidth;
            imgHeight = pageWidth * (canvas.height / canvas.width);
        }

        // Center the image
        const xPadding = 0; // Start from the left edge
        const yPadding = 0; // Start from the top edge

        try {
            pdf.addImage(
                imgData,
                'PNG',
                xPadding,
                yPadding,
                imgWidth,
                imgHeight,
            );

            // Save the PDF
            pdf.save(
                `${resume.templateName || 'resume'}_${
                    new Date().toISOString().split('T')[0]
                }.pdf`,
            );

            return {success: true};
        } catch (imageError) {
            console.error('Error adding image to PDF:', imageError);
            return {
                success: false,
                error: 'Failed to add image to PDF',
                details: {
                    imageData: imgData
                        ? imgData.substring(0, 100) + '...'
                        : 'No image data',
                    canvasWidth: canvas.width,
                    canvasHeight: canvas.height,
                    imgWidth,
                    imgHeight,
                },
            };
        }
    } catch (error) {
        console.error('Error in downloadResumePDF:', error);
        return {
            success: false,
            error:
                error.message ||
                'An unexpected error occurred during PDF generation',
        };
    }
};
