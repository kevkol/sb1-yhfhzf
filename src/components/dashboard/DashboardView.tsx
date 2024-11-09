import React, { useState } from 'react';
import BoxCard from './BoxCard';
import { useTranslation } from '../../hooks/useTranslation';
import { Box } from '../../types';

interface DashboardViewProps {
  boxes: Box[];
  onBoxSelect: (boxId: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ boxes, onBoxSelect }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('all');

  // Ermitteln Sie die eindeutigen Techniker aus den Boxen
  const technicians = Array.from(new Set(boxes.map(box => box.assignedTechnician).filter(Boolean)));
  
  // Filter boxes based on search term and selected technician
  const filteredBoxes = boxes.filter(box => 
    (box.boxNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (box.deviceType && box.deviceType.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedTechnician === 'all' || 
     (selectedTechnician === 'unassigned' ? !box.assignedTechnician : box.assignedTechnician === selectedTechnician))
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder={t('dashboard.searchBoxes')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select 
          value={selectedTechnician}
          onChange={(e) => setSelectedTechnician(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">{t('dashboard.allTechnicians')}</option>
          <option value="unassigned">{t('dashboard.unassigned')}</option>
          {technicians.map(tech => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredBoxes.length === 0 ? (
          <p>{t('common.noData')}</p>
        ) : (
          filteredBoxes.map((box) => (
            <BoxCard 
              key={box.id} 
              box={box} 
              onClick={onBoxSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardView;
