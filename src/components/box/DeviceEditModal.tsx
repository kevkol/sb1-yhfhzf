import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Device, Status } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface DeviceEditModalProps {
  device: Device;
  onClose: () => void;
  onUpdate: (deviceId: string, updates: Partial<Device>) => void;
}

export default function DeviceEditModal({
  device,
  onClose,
  onUpdate,
}: DeviceEditModalProps) {
  const { t } = useTranslation();
  const [updates, setUpdates] = useState<Partial<Device>>({
    status: device.status,
    pointOfError: device.pointOfError || '',
    errorAnalysis: device.errorAnalysis || '',
    errorReason: device.errorReason || '',
    internalComments: device.internalComments || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(device.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('device.edit')} - {device.serialNumber}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('common.status')}
            </label>
            <select
              value={updates.status}
              onChange={(e) => setUpdates({ ...updates, status: e.target.value as Status })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('device.pointOfError')}
            </label>
            <input
              type="text"
              value={updates.pointOfError}
              onChange={(e) => setUpdates({ ...updates, pointOfError: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('device.errorReason')}
            </label>
            <input
              type="text"
              value={updates.errorReason}
              onChange={(e) => setUpdates({ ...updates, errorReason: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('device.errorAnalysis')}
            </label>
            <textarea
              value={updates.errorAnalysis}
              onChange={(e) => setUpdates({ ...updates, errorAnalysis: e.target.value })}
              rows={3}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('device.internalComments')}
            </label>
            <textarea
              value={updates.internalComments}
              onChange={(e) => setUpdates({ ...updates, internalComments: e.target.value })}
              rows={3}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}