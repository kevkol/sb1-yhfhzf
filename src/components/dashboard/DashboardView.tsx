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

  // Filter boxes based on search term
  const filteredBoxes = boxes.filter(box => 
    box.boxNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (box.deviceType && box.deviceType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('dashboard.title')}</h1>
      
      <div className="mb-4">
        <input 
          type="text" 
          placeholder={t('dashboard.searchBoxes')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
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
