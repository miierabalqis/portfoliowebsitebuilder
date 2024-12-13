//Download.js

import {doc, getDoc} from 'firebase/firestore';
import {projectFirestore} from '../../../../firebase/config';
import {getAuth} from 'firebase/auth';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads a resume as a PDF
 * @param {Object} params - Parameters for resume download
 * @param {Object} params.resume - Resume object containing ID
 * @param {React.RefObject} params.resumeRef - React ref to the resume template DOM element
 * @returns {Promise<{success: boolean, error?: string}>} Download result
 */

const preloadImage = async (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
};

export const downloadResumePDF = async ({resume, resumeRef}) => {
    try {
        console.log('Download function called with:', {resume, resumeRef});

        if (!resume || !resumeRef?.current) {
            console.error('Invalid inputs');
            return {success: false, error: 'Invalid inputs'};
        }

        // Function to convert image to base64
        const getBase64Image = async (imgElement) => {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                canvas.width = imgElement.naturalWidth || imgElement.width;
                canvas.height = imgElement.naturalHeight || imgElement.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgElement, 0, 0);

                // Force image to load completely
                imgElement.crossOrigin = 'Anonymous';
                imgElement.onload = () => {
                    ctx.drawImage(imgElement, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                };
                imgElement.onerror = reject;

                // Trigger load if not already loaded
                if (imgElement.complete) {
                    imgElement.onload();
                }
            });
        };

        // Pre-process all images
        const processImages = async () => {
            const images = resumeRef.current.getElementsByTagName('img');

            for (const img of images) {
                try {
                    if (img.src.startsWith('data:')) continue;

                    // Preload the image
                    const preloadedImg = await preloadImage(img.src);

                    const canvas = document.createElement('canvas');
                    canvas.width = preloadedImg.width;
                    canvas.height = preloadedImg.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(preloadedImg, 0, 0);

                    const base64Data = canvas.toDataURL('image/png');
                    img.src = base64Data;

                    // Wait for the new source to be applied
                    await new Promise((resolve) => setTimeout(resolve, 100));
                } catch (error) {
                    console.warn('Failed to process image:', error);
                }
            }
        };

        // Process all images before capture
        await processImages();

        // Wait for any pending renders
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Store original styles
        const element = resumeRef.current;
        const originalStyles = {
            position: element.style.position,
            visibility: element.style.visibility,
            display: element.style.display,
            zIndex: element.style.zIndex,
        };

        // Position for capture
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.visibility = 'visible';
        element.style.display = 'block';
        element.style.zIndex = '-9999';
        element.style.backgroundColor = 'white';

        // Capture the element
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            imageTimeout: 30000,
            logging: true,
            onclone: (clonedDoc) => {
                const clonedImages = clonedDoc.getElementsByTagName('img');
                Array.from(clonedImages).forEach((img) => {
                    img.crossOrigin = 'anonymous';
                    if (!img.complete) {
                        img.src = img.src; // Force reload
                    }
                });
            },
        });

        // Restore original styles
        Object.assign(element.style, originalStyles);

        // Create PDF with proper dimensions
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        // Calculate dimensions
        const pageWidth = 210;
        const pageHeight = 297;
        const imageAspectRatio = canvas.width / canvas.height;

        let imgWidth, imgHeight;
        if (canvas.height / canvas.width > pageHeight / pageWidth) {
            imgHeight = pageHeight;
            imgWidth = pageHeight * (canvas.width / canvas.height);
        } else {
            imgWidth = pageWidth;
            imgHeight = pageWidth * (canvas.height / canvas.width);
        }

        // Add the image to PDF
        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(
            imgData,
            'PNG',
            0,
            0,
            imgWidth,
            imgHeight,
            undefined,
            'FAST',
        );

        // Save the PDF
        pdf.save(
            `${resume.templateName || 'resume'}_${
                new Date().toISOString().split('T')[0]
            }.pdf`,
        );

        return {success: true};
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
