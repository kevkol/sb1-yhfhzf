import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { Device, Status } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

// Define a more specific type for translations
type TranslationValue = string | { [key: string]: string };

// Helper function to convert translation to string
function translateToString(translation: TranslationValue): string {
  if (typeof translation === 'string') return translation;
  if (typeof translation === 'object' && translation !== null) {
    // If it's an object, try to get the first string value
    const values = Object.values(translation);
    const stringValue = values.find((val) => typeof val === 'string');
    return typeof stringValue === 'string' ? stringValue : '';
  }
  return '';
}

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);

    try {
      // First, update local state
      onUpdate(device.id, updates);

      // Then, update Salesforce
      const salesforcePayload = {
        salesforceId: device.salesforceId || device.id,
        status: updates.status,
        errorLocation: updates.pointOfError || '',
        errorReason: updates.errorReason || device.errorReason,
        errorAnalysis: updates.errorAnalysis || device.errorAnalysis,
        internalComments: updates.internalComments || device.internalComments,
      };

      await axios.patch('http://127.0.0.1:8500/update_service_ticket', salesforcePayload);

      onClose();
    } catch (error) {
      console.error('Error updating device:', error);
      setUpdateError(translateToString(t('device.updateError')));
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {translateToString(t('device.edit'))} - {device.serialNumber}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {updateError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {updateError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateToString(t('common.status'))}
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
              {translateToString(t('device.pointOfError'))}
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
              {translateToString(t('device.errorReason'))}
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
              {translateToString(t('device.errorAnalysis'))}
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
              {translateToString(t('device.internalComments'))}
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
              disabled={isUpdating}
            >
              {translateToString(t('common.cancel'))}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isUpdating}
            >
              {isUpdating 
                ? translateToString(t('common.saving')) 
                : translateToString(t('common.save'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
