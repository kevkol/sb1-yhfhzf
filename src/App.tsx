import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import BoxDetailView from './components/box/BoxDetailView';
import { Box, Status } from './types';

const getBoxes = async (): Promise<Box[]> => {
  try {
    console.log('Fetching boxes from API...');
    const response = await fetch('http://127.0.0.1:8000/boxes', {
      method: 'GET',
      mode: 'cors', // explicitly set CORS mode
      credentials: 'include', // include credentials like cookies
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Explicitly set the origin header
        'Origin': 'http://localhost:5173'
      }
    });
    
    console.log('Full Response Object:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      type: response.type,
      url: response.url
    });

    // Log the raw text response before parsing
    const rawText = await response.text();
    console.log('Raw API Response Text:', rawText);

    // Try to parse the raw text as JSON
    let data;
    try {
      data = JSON.parse(rawText);
      console.log('Parsed JSON Data:', data);
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      console.log('Unparseable response text:', rawText);
      throw new Error(`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
    }

    // Validate the parsed data
    if (!Array.isArray(data)) {
      console.error('API response is not an array:', data);
      throw new Error('API did not return an array of boxes');
    }
    
    return data;
  } catch (error) {
    console.error('Detailed error fetching boxes:', error);
    return []; // Return empty array on error
  }
};

function App() {
  const [language, setLanguage] = useState<'en' | 'da'>('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        console.log('Starting fetchBoxes...');
        const fetchedBoxes = await getBoxes();
        
        console.log('Fetched boxes count:', fetchedBoxes.length);
        
        if (fetchedBoxes.length === 0) {
          setError('No boxes were retrieved from the API');
        }
        
        setBoxes(fetchedBoxes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in fetchBoxes:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchBoxes();
  }, []);

  const handleBoxSelect = (boxId: string) => {
    const box = boxes.find(b => b.id === boxId);
    if (box) {
      setSelectedBox(box);
    }
  };

  const handleStatusChange = (status: Status) => {
    if (selectedBox) {
      // TODO: Implement status update logic
      console.log('Status updated:', status);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        toggleLanguage={() => setLanguage(language === 'en' ? 'da' : 'en')}
        language={language}
      />
      
      <main className="pt-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">
            Error: {error}
          </div>
        ) : boxes.length === 0 ? (
          <div className="text-yellow-500 text-center p-4">
            No boxes found
          </div>
        ) : (
          <DashboardView
            boxes={boxes}
            onBoxSelect={handleBoxSelect}
          />
        )}
      </main>

      {selectedBox && (
        <BoxDetailView
          box={selectedBox}
          onClose={() => setSelectedBox(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default App;