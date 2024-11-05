import React from 'react';
import { X, Package, AlertCircle } from 'lucide-react';
import { Box, Device, Status } from '../../types';
import DeviceList from './DeviceList';
import StatusBadge from '../ui/StatusBadge';

interface BoxDetailViewProps {
  box: Box;
  onClose: () => void;
  onStatusChange: (status: Status) => void;
}

export default function BoxDetailView({ box, onClose, onStatusChange }: BoxDetailViewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Box #{box.boxNumber}</h2>
              <p className="text-sm text-gray-500">{box.deviceType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <StatusBadge status={box.status} className="mt-1" />
              </div>
              {box.assignedTechnician && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned Technician</label>
                  <p className="mt-1 text-gray-900">{box.assignedTechnician}</p>
                </div>
              )}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Important Note</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Changes made to devices in this box will be synchronized with Salesforce within 15 minutes.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Devices ({box.devices.length})</h3>
            <DeviceList devices={box.devices} />
          </div>
        </div>
      </div>
    </div>
  );
}