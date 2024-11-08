import React, { useState } from 'react';
import axios from 'axios';
import { X, Package, AlertCircle } from 'lucide-react';
import { Box, Device, Status } from '../../types';
import DeviceList from './DeviceList';
import StatusBadge from '../ui/StatusBadge';
import { useTranslation } from '../../hooks/useTranslation';

interface BoxDetailViewProps {
  box: Box;
  onClose: () => void;
  onUpdateBox?: (boxId: string, updates: Partial<Box>) => void;
}

export default function BoxDetailView({ 
  box, 
  onClose, 
  onUpdateBox
}: BoxDetailViewProps) {
  const [localDevices, setLocalDevices] = useState<Device[]>(box.devices);
  const [localBoxStatus, setLocalBoxStatus] = useState<Status>(box.status);
  const { t } = useTranslation();

  const handleUpdateDevices = async (updates: Partial<Device>, deviceIds: string[]) => {
    try {
      // Update local state first
      const updatedDevices = localDevices.map(device => 
        deviceIds.includes(device.id) 
          ? { ...device, ...updates } 
          : device
      );
      setLocalDevices(updatedDevices);

      // Prepare Salesforce updates
      const salesforceUpdates = deviceIds.map(deviceId => {
        const device = localDevices.find(d => d.id === deviceId);
        if (!device) return null;

        return {
          salesforceId: device.salesforceId || device.id,
          status: updates.status || device.status,
          errorMessageCustomer: updates.errorReason || device.errorReason,
          errorLocation: updates.pointOfError || device.pointOfError
        };
      }).filter(update => update !== null);

      // Batch update to Salesforce
      await Promise.all(salesforceUpdates.map(update => 
        axios.patch('/update_service_ticket', update)
      ));

      // If a parent update method is provided, call it
      if (onUpdateBox) {
        onUpdateBox(box.id, { devices: updatedDevices });
      }
    } catch (error) {
      console.error('Error updating devices:', error);
      // Optionally, revert local state if Salesforce update fails
      setLocalDevices(box.devices);
    }
  };

  const handleBoxStatusChange = async (newStatus: Status) => {
    try {
      setLocalBoxStatus(newStatus);

      // Update Salesforce or backend with new box status
      await axios.patch(`/update_box/${box.id}`, { status: newStatus });

      // Notify parent component of status change
      if (onUpdateBox) {
        onUpdateBox(box.id, { status: newStatus });
      }
    } catch (error) {
      console.error('Error updating box status:', error);
      // Revert status if update fails
      setLocalBoxStatus(box.status);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t('box.details')} #{box.boxNumber}</h2>
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
                <label className="text-sm font-medium text-gray-700">{t('common.status')}</label>
                <div className="flex items-center gap-2">
                  <StatusBadge status={localBoxStatus} className="mt-1" />
                  
                </div>
              </div>
              {box.assignedTechnician && (
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('box.assignedTechnician')}</label>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={box.assignedTechnician} className="mt-1" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">{t('common.importantNote')}</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  {t('box.syncNote')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('box.deviceCount.multiple')} ({localDevices.length})</h3>
            <DeviceList 
              devices={localDevices} 
              onUpdateDevices={handleUpdateDevices} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
