import { useState, useEffect, useCallback } from 'react';

function useLocalStorage(key, initialValue) {
  // State to store our value, initialized from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Setter function that updates state and localStorage
  const setValue = useCallback((value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      // *** CRUCIAL: Dispatch a custom event for changes within the same tab ***
      window.dispatchEvent(
        new CustomEvent('localStorageChange', {
          detail: {
            key,
            newValue: valueToStore,
          },
        })
      );
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  // Effect to add and remove event listeners
  useEffect(() => {
    // Handler for the native 'storage' event (for other tabs/windows)
    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          // Parse the new value from the event (it's a string)
          setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
        } catch (error) {
          console.error('Error parsing localStorage value from storage event:', error);
          setStoredValue(initialValue);
        }
      }
    };

    // Handler for our custom 'localStorageChange' event (for the same tab)
    const handleCustomStorageChange = (event) => {
      // Check if the event detail matches our key
      if (event.detail.key === key) {
        setStoredValue(event.detail.newValue);
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange); // Listening to our custom event

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, [key, initialValue]); // Dependencies for useEffect

  return [storedValue, setValue];
}

export default useLocalStorage;