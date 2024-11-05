import React, { useState } from 'react';
import { Device } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { Calendar, User, Pencil } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import BulkUpdateModal from './BulkUpdateModal';
import DeviceEditModal from './DeviceEditModal';

interface DeviceListProps {
  devices: Device[];
  onUpdateDevices: (updates: Partial<Device>, deviceIds: string[]) => void;
}

export default function DeviceList({ devices, onUpdateDevices }: DeviceListProps) {
  const { t } = useTranslation();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const toggleDevice = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const toggleAll = () => {
    setSelectedDevices(prev =>
      prev.length === devices.length ? [] : devices.map(d => d.id)
    );
  };

  const handleBulkUpdate = (updates: Partial<Device>) => {
    onUpdateDevices(updates, selectedDevices);
    setSelectedDevices([]);
    setShowBulkUpdate(false);
  };

  const handleSingleUpdate = (deviceId: string, updates: Partial<Device>) => {
    onUpdateDevices(updates, [deviceId]);
  };

  return (
    <div>
      {devices.length > 1 && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedDevices.length === devices.length}
                onChange={toggleAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('box.selectAll')}</span>
            </label>
            <span className="text-sm text-gray-500">
              {selectedDevices.length} {t('common.devices')} {t('common.selected')}
            </span>
          </div>
          
          {selectedDevices.length > 0 && (
            <button
              onClick={() => setShowBulkUpdate(true)}
              className="btn-primary"
            >
              {t('box.updateSelected')}
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start gap-3">
              {devices.length > 1 && (
                <input
                  type="checkbox"
                  checked={selectedDevices.includes(device.id)}
                  onChange={() => toggleDevice(device.id)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {device.type} - {t('device.serialNumber')}: {device.serialNumber}
                    </h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{t('device.warrantyUntil')}: {device.warrantyUntilDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{device.customerName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={device.status} />
                    <button
                      onClick={() => setEditingDevice(device)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('device.customerIssue')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{device.errorMessageCustomer}</p>
                  </div>
                  
                  {device.pointOfError && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('device.pointOfError')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{device.pointOfError}</p>
                    </div>
                  )}
                  
                  {device.errorReason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('device.errorReason')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{device.errorReason}</p>
                    </div>
                  )}
                  
                  {device.errorAnalysis && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('device.errorAnalysis')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{device.errorAnalysis}</p>
                    </div>
                  )}
                  
                  {device.internalComments && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('device.internalComments')}
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{device.internalComments}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showBulkUpdate && (
        <BulkUpdateModal
          devices={devices}
          selectedDevices={selectedDevices}
          onClose={() => setShowBulkUpdate(false)}
          onUpdate={handleBulkUpdate}
        />
      )}

      {editingDevice && (
        <DeviceEditModal
          device={editingDevice}
          onClose={() => setEditingDevice(null)}
          onUpdate={handleSingleUpdate}
        />
      )}
    </div>
  );
}