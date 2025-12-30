// utils/copyToClipboard.ts
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern clipboard API (recommended)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or insecure contexts
      return fallbackCopyToClipboard(text);
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

// Fallback method for older browsers
function fallbackCopyToClipboard(text: string): boolean {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    // Add to document
    document.body.appendChild(textArea);
    
    // Select and copy
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}

// Function to copy text from an element by ID
export async function copyFromElementId(elementId: string): Promise<boolean> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id "${elementId}" not found`);
      return false;
    }
    
    // Get text content (for any element)
    const text = element.textContent?.trim() || 
                 (element as HTMLInputElement).value?.trim() || 
                 '';
    
    if (!text) {
      console.error('No text found in element');
      return false;
    }
    
    return await copyToClipboard(text);
  } catch (error) {
    console.error('Failed to copy from element:', error);
    return false;
  }
}

// Function to copy text from an element by selector
export async function copyFromElementSelector(selector: string): Promise<boolean> {
  try {
    const element = document.querySelector(selector);
    if (!element) {
      console.error(`Element with selector "${selector}" not found`);
      return false;
    }
    
    const text = element.textContent?.trim() || 
                 (element as HTMLInputElement).value?.trim() || 
                 '';
    
    if (!text) {
      console.error('No text found in element');
      return false;
    }
    
    return await copyToClipboard(text);
  } catch (error) {
    console.error('Failed to copy from element:', error);
    return false;
  }
}