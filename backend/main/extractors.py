"""Text extraction module for handling various document formats.

This module provides utilities for extracting text from:
- PDF files (native and scanned)
- DOCX files (Microsoft Word)
- Image files (with OCR)
- Plain text files

Each extraction method gracefully handles missing dependencies.
"""

import os

# Optional imports with graceful fallbacks
try:
    import fitz  # PyMuPDF for PDF text extraction
except Exception:
    fitz = None

try:
    import docx  # python-docx for DOCX extraction
except Exception:
    docx = None

try:
    import pytesseract  # OCR engine
except Exception:
    pytesseract = None

try:
    from pdf2image import convert_from_path  # Convert PDF pages to images for OCR
except Exception:
    convert_from_path = None

try:
    from PIL import Image  # Image processing for OCR
except Exception:
    Image = None


class TextExtractor:
    """Unified text extraction handler with intelligent fallback strategy."""
    
    # Minimum text length threshold before trying OCR fallback
    MIN_TEXT_LENGTH = 120
    
    # OCR DPI setting for better accuracy
    OCR_DPI = 300
    
    @staticmethod
    def extract_from_pdf(path_or_file):
        """Extract text from PDF using native PDF parsing (PyMuPDF).
        
        Args:
            path_or_file (str or file): Path to PDF file or file object
            
        Returns:
            str: Extracted text from all pages, empty string if extraction fails
            
        Note:
            This method works best for text-based PDFs. For scanned PDFs (images),
            use ocr_pdf() instead.
        """
        if not fitz:
            return ''
        text = []
        try:
            doc = fitz.open(path_or_file)
            for page in doc:
                text.append(page.get_text())
            doc.close()
        except Exception:
            return ''
        return "\n".join(text)

    @staticmethod
    def extract_from_docx(path_or_file):
        """Extract text from DOCX files (python-docx).
        
        Args:
            path_or_file (str or file): Path to DOCX file or file object
            
        Returns:
            str: Extracted text from all paragraphs, empty string if extraction fails
        """
        if not docx:
            return ''
        try:
            doc = docx.Document(path_or_file)
            return "\n".join(p.text for p in doc.paragraphs)
        except Exception:
            return ''

    @staticmethod
    def ocr_pdf(path):
        """Convert PDF pages to images and extract text using OCR (pytesseract).
        
        This is useful for scanned PDFs or PDFs where native text extraction
        yields little or no text.
        
        Args:
            path (str): Path to PDF file
            
        Returns:
            str: Extracted text from OCR on all pages, empty string if fails
            
        Note:
            Requires Tesseract OCR and Poppler to be installed on system.
            This can be slow for multi-page PDFs (1-5 seconds per page).
        """
        if not convert_from_path or not pytesseract:
            return ''
        text_parts = []
        try:
            # Convert PDF pages to images (300 DPI for better accuracy)
            pages = convert_from_path(path, dpi=TextExtractor.OCR_DPI)
            for page in pages:
                # Run OCR on each page image
                txt = pytesseract.image_to_string(page)
                text_parts.append(txt)
        except Exception:
            return ''
        return "\n".join(text_parts)

    @staticmethod
    def ocr_image(path):
        """Extract text from image files using OCR (pytesseract).
        
        Args:
            path (str): Path to image file (PNG, JPG, TIFF, etc.)
            
        Returns:
            str: Extracted text via OCR, empty string if fails
            
        Note:
            Requires Tesseract OCR to be installed on system.
        """
        if not Image or not pytesseract:
            return ''
        try:
            img = Image.open(path)
            return pytesseract.image_to_string(img)
        except Exception:
            return ''

    @staticmethod
    def extract_from_file(file_path, file_name):
        """Unified text extraction with intelligent fallbacks.
        
        Strategy:
        1. Try native extraction (PyMuPDF for PDF, python-docx for DOCX)
        2. If text is short (<120 chars), try OCR fallback
        3. For image files, try OCR directly
        
        Args:
            file_path (str): Full file path
            file_name (str): File name with extension
            
        Returns:
            str: Extracted text using best available method
            
        Note:
            This function gracefully degrades - if native extraction fails,
            it attempts OCR. If OCR is unavailable, returns available text.
        """
        text = ''
        lname = file_name.lower()
        
        try:
            # Try native extraction first
            if lname.endswith('.pdf') and fitz:
                text = TextExtractor.extract_from_pdf(file_path)
            elif (lname.endswith('.docx') or lname.endswith('.doc')) and docx:
                text = TextExtractor.extract_from_docx(file_path)
            elif any(lname.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.tiff']):
                text = TextExtractor.ocr_image(file_path)
            else:
                # Try reading as plain text file
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    text = f.read()
        except Exception:
            text = ''

        # If PDF yielded little text, try OCR
        if (not text or len(text.strip()) < TextExtractor.MIN_TEXT_LENGTH) and lname.endswith('.pdf'):
            ocr_text = TextExtractor.ocr_pdf(file_path)
            if ocr_text and len(ocr_text.strip()) > len(text.strip()):
                text = ocr_text

        # If image yielded little text, retry OCR
        if (not text or len(text.strip()) < TextExtractor.MIN_TEXT_LENGTH) and any(lname.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.tiff']):
            ocr_text = TextExtractor.ocr_image(file_path)
            if ocr_text and len(ocr_text.strip()) > len(text.strip()):
                text = ocr_text

        return text
