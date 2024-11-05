import React, { useState } from 'react';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import BoxDetailView from './components/box/BoxDetailView';
import { Box, Status } from './types';

// Mock data for development
const mockBoxes: Box[] = [
  {
    id: '1',
    boxNumber: 'BOX-001',
    status: 'In Progress',
    deviceType: 'Microphone Type 26AG',
    devices: [
      {
        id: '1',
        serialNumber: 'SN001',
        type: 'Microphone Type 26AG',
        warrantyUntilDate: '2025-12-31',
        errorMessageCustomer: 'Device not calibrating properly',
        customerName: 'Acme Corp',
        status: 'In Progress'
      }
    ],
    assignedTechnician: 'John Doe'
  },
  {
    id: '2',
    boxNumber: 'BOX-002',
    status: 'New',
    deviceType: 'Microphone Type 40HF',
    devices: [
      {
        id: '2',
        serialNumber: 'SN002',
        type: 'Microphone Type 40HF',
        warrantyUntilDate: '2024-06-30',
        errorMessageCustomer: 'No signal output',
        customerName: 'TechCo Industries',
        status: 'New'
      }
    ]
  }
];

function App() {
  const [language, setLanguage] = useState<'en' | 'da'>('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);

  const handleBoxSelect = (boxId: string) => {
    const box = mockBoxes.find(b => b.id === boxId);
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
        <DashboardView
          boxes={mockBoxes}
          onBoxSelect={handleBoxSelect}
        />
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