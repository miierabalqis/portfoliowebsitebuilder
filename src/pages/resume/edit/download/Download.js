import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Function to download the resume preview as a PDF with images included.
 * @param {Object} params - Parameters containing the resume reference.
 * @param {Object} params.resumeRef - A React ref or DOM element containing the resume content.
 * @returns {Promise<Object>} - Result object indicating success or failure.
 */
export const downloadResumePDF = async ({resumeRef}) => {
    if (!resumeRef?.current) {
        return {success: false, error: 'Resume preview container not found'};
    }

    try {
        const container = resumeRef.current;

        // Ensuring all images are loaded before capturing
        const allImages = Array.from(container.querySelectorAll('img'));
        await Promise.all(
            allImages.map((img) => {
                return new Promise((resolve, reject) => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = resolve;
                        img.onerror = reject;
                    }
                });
            }),
        );

        // Capture the container as an image using html2canvas
        const canvas = await html2canvas(container, {
            scale: 2, // Ensures high resolution
            useCORS: true, // Enables capturing of images hosted externally
            allowTaint: false, // Prevents cross-origin issues
        });

        const imgData = canvas.toDataURL('image/png');

        // Create a new PDF instance
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate dimensions to fit the image inside the PDF
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const aspectRatio = canvasWidth / canvasHeight;

        const pdfAspectHeight = pdfWidth / aspectRatio;
        const finalHeight =
            pdfAspectHeight > pdfHeight ? pdfHeight : pdfAspectHeight;
        const finalWidth = finalHeight * aspectRatio;

        const offsetX = (pdfWidth - finalWidth) / 2;
        const offsetY = (pdfHeight - finalHeight) / 2;

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', offsetX, offsetY, finalWidth, finalHeight);

        // Generate a file name and trigger the download
        const fileName = `Resume_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

        return {success: true};
    } catch (error) {
        console.error('Error capturing or downloading the PDF:', error);
        return {success: false, error: 'Failed to create PDF'};
    }
};
