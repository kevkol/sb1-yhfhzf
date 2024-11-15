import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import BoxDetailView from './components/box/BoxDetailView';
import { Box } from './types';

const getBoxes = async (): Promise<Box[]> => {
  try {
    console.log('Fetching boxes from API...');
    const response = await fetch('http://127.0.0.1:8500/boxes', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      }
    });
    
    const rawText = await response.text();
    console.log('Raw API Response Text:', rawText);

    let data;
    try {
      data = JSON.parse(rawText);
      console.log('Parsed JSON Data:', data);
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      throw new Error(`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
    }

    if (!Array.isArray(data)) {
      console.error('API response is not an array:', data);
      throw new Error('API did not return an array of boxes');
    }
    
    return data;
  } catch (error) {
    console.error('Detailed error fetching boxes:', error);
    return [];
  }
};

function AppContent() {
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

  const handleUpdateBox = (boxId: string, updates: Partial<Box>) => {
    setBoxes(prevBoxes => 
      prevBoxes.map(box => 
        box.id === boxId 
          ? { ...box, ...updates } 
          : box
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
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
          onUpdateBox={handleUpdateBox}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
