import { useEffect, useState } from 'react';

// Simplified font loading - just return true immediately
// Using system fonts instead of custom fonts to avoid loading issues
export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Simulate a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setFontsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return fontsLoaded;
}
