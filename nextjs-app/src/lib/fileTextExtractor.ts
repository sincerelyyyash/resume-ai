/**
 * Production-grade file text extraction utilities
 */

/**
 * Extract text from PDF file with robust error handling
 */
export const extractTextFromPDF = async (fileBuffer: Buffer): Promise<string> => {
  try {
    // Validate buffer
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('Invalid or empty PDF buffer');
    }

    // Log buffer info for debugging
    console.log('Processing PDF buffer:', {
      size: fileBuffer.length,
      isBuffer: Buffer.isBuffer(fileBuffer),
      firstBytes: fileBuffer.slice(0, 8).toString('hex')
    });

    // Check if it's actually a PDF by checking the header
    const pdfHeader = fileBuffer.slice(0, 4).toString();
    if (!pdfHeader.startsWith('%PDF')) {
      throw new Error('Invalid PDF format - missing PDF header');
    }

    // Import pdf-parse with better error handling
    let pdfParse;
    try {
      const pdfParseModule = await import('pdf-parse');
      pdfParse = pdfParseModule.default || pdfParseModule;
    } catch (importError) {
      console.error('Failed to import pdf-parse:', importError);
      throw new Error('PDF parsing library not available');
    }

    // Parse the PDF with error handling
    const data = await pdfParse(fileBuffer, {
      // Disable version check to avoid test file issues
      version: 'default'
    });

    if (!data || !data.text) {
      throw new Error('No text could be extracted from the PDF');
    }

    const extractedText = data.text.trim();
    if (extractedText.length === 0) {
      throw new Error('PDF appears to be empty or contains no extractable text');
    }

    console.log('PDF extraction successful:', {
      textLength: extractedText.length,
      pages: data.numpages || 'unknown'
    });

    return extractedText;

  } catch (error) {
    console.error('Error extracting text from PDF:', {
      error: error instanceof Error ? error.message : String(error),
      bufferSize: fileBuffer?.length || 0,
      timestamp: new Date().toISOString()
    });
    
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
    throw new Error('Failed to extract text from PDF file');
  }
};

/**
 * Extract text from DOCX file with robust error handling
 */
export const extractTextFromDOCX = async (fileBuffer: Buffer): Promise<string> => {
  try {
    // Validate buffer
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('Invalid or empty DOCX buffer');
    }

    console.log('Processing DOCX buffer:', {
      size: fileBuffer.length,
      isBuffer: Buffer.isBuffer(fileBuffer)
    });

    // Import mammoth with error handling
    let mammoth;
    try {
      mammoth = await import('mammoth');
    } catch (importError) {
      console.error('Failed to import mammoth:', importError);
      throw new Error('DOCX parsing library not available');
    }

    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    
    if (!result || typeof result.value !== 'string') {
      throw new Error('Invalid response from DOCX parser');
    }

    const extractedText = result.value.trim();
    if (extractedText.length === 0) {
      throw new Error('DOCX appears to be empty or contains no extractable text');
    }

    console.log('DOCX extraction successful:', {
      textLength: extractedText.length,
      warnings: result.messages?.length || 0
    });

    return extractedText;

  } catch (error) {
    console.error('Error extracting text from DOCX:', {
      error: error instanceof Error ? error.message : String(error),
      bufferSize: fileBuffer?.length || 0,
      timestamp: new Date().toISOString()
    });
    
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from DOCX: ${error.message}`);
    }
    throw new Error('Failed to extract text from DOCX file');
  }
};

/**
 * Extract text from file based on MIME type with comprehensive validation
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    // Validate file object
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file object provided');
    }

    console.log('Starting text extraction for file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    });

    // Convert file to buffer with error handling
    let buffer: Buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } catch (bufferError) {
      console.error('Failed to convert file to buffer:', bufferError);
      throw new Error('Failed to read file content');
    }

    if (!buffer || buffer.length === 0) {
      throw new Error('File appears to be empty');
    }

    // Extract text based on file type
    switch (file.type) {
      case 'application/pdf':
        return await extractTextFromPDF(buffer);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await extractTextFromDOCX(buffer);
      default:
        throw new Error(`Unsupported file type: ${file.type}. Only PDF and DOCX files are supported.`);
    }

  } catch (error) {
    console.error('File text extraction failed:', {
      fileName: file?.name || 'unknown',
      fileType: file?.type || 'unknown',
      fileSize: file?.size || 0,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during text extraction');
  }
};

/**
 * Validate file before processing with comprehensive checks
 */
export const validateFile = (file: File): void => {
  // File object validation
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file object. Please provide a valid file.');
  }

  // File type validation
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only PDF and DOCX files are supported.');
  }

  // File size validation
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the maximum limit of 5MB.`);
  }

  // Empty file validation
  if (file.size === 0) {
    throw new Error('File is empty. Please upload a file with content.');
  }

  // File name validation
  if (!file.name || file.name.trim().length === 0) {
    throw new Error('File must have a valid name.');
  }

  console.log('File validation passed:', {
    name: file.name,
    type: file.type,
    size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
  });
}; 