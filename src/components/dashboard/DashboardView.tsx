import React, { useState } from 'react';
import { LayoutGrid, List, Search, Filter } from 'lucide-react';
import BoxCard from './BoxCard';
import { Box } from '../../types';

interface DashboardViewProps {
  boxes: Box[];
  onBoxSelect: (boxId: string) => void;
}

export default function DashboardView({ boxes, onBoxSelect }: DashboardViewProps) {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBoxes = boxes.filter(box => 
    box.boxNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    box.deviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search boxes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
            
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded ${viewType === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <LayoutGrid className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded ${viewType === 'list' ? 'bg-white shadow' : ''}`}
              >
                <List className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
          {filteredBoxes.map(box => (
            <BoxCard
              key={box.id}
              box={box}
              onClick={onBoxSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}