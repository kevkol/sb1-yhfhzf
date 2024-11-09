import React from 'react';
import { Box } from '../../types';
import { Package, ChevronRight } from 'lucide-react';
// import { useTranslation } from 'react-i18next'; // Stellen Sie sicher, dass dieser Import korrekt ist
import { useTranslation } from '../../hooks/useTranslation';


interface BoxCardProps {
  box: Box;
  onClick: (boxId: string) => void;
}

export default function BoxCard({ box, onClick }: BoxCardProps) {
  const { t } = useTranslation();

  const statusColors = {
    'New': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'On Hold': 'bg-red-100 text-red-800'
  };

  return (
    <div 
      onClick={() => onClick(box.id)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-8 h-8 text-gray-400" />
          <div>
            <h3 className="font-medium text-gray-900">Box #{box.boxNumber}</h3>
            <p className="text-sm text-gray-500">{box.deviceType}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[box.status]}`}>
            {t(`box.status.${box.status.toLowerCase()}`)}
          </span>
          <span className="text-sm text-gray-500">
            {box.devices.length} {box.devices.length === 1 ? t('box.deviceCount.single') : t('box.deviceCount.multiple')}
          </span>
        </div>
        
        {box.assignedTechnician && (
          <span className="text-sm text-gray-500">
            {t('box.assignedTechnician')}: {box.assignedTechnician}
          </span>
        )}
      </div>
    </div>
  );
}