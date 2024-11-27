import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const downloadResume = async (resumeElementId, fileName = 'resume.pdf') => {
    const resumeElement = document.getElementById(resumeElementId);

    if (!resumeElement) {
        console.error(`Element with ID "${resumeElementId}" not found.`);
        return;
    }

    try {
        const canvas = await html2canvas(resumeElement);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};

export default downloadResume;