import { useState, useCallback } from "react";

export function useFileParser() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Parse file content
  const parseFile = useCallback(async (file: File): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate file type
      if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
        throw new Error('Only .txt and .md files are supported');
      }
      
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setLoading(false);
          resolve(content);
        };
        
        reader.onerror = () => {
          setLoading(false);
          setError('Error reading file');
          reject(new Error('Error reading file'));
        };
        
        reader.readAsText(file);
      });
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  }, []);

  return {
    parseFile,
    loading,
    error,
  };
}
