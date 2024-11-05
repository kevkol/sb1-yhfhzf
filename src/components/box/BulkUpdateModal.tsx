import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Device, Status } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface BulkUpdateModalProps {
  devices: Device[];
  selectedDevices: string[];
  onClose: () => void;
  onUpdate: (updates: Partial<Device>) => void;
}

export default function BulkUpdateModal({
  devices,
  selectedDevices,
  onClose,
  onUpdate,
}: BulkUpdateModalProps) {
  const { t } = useTranslation();
  const [updates, setUpdates] = useState<Partial<Device>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('box.bulkUpdate')} ({selectedDevices.length} {t('common.devices')})
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
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setUpdates({ ...updates, status: e.target.value as Status })}
            >
              <option value="">{t('common.select')}</option>
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
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setUpdates({ ...updates, pointOfError: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('device.errorAnalysis')}
            </label>
            <textarea
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              onChange={(e) => setUpdates({ ...updates, errorAnalysis: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('device.internalComments')}
            </label>
            <textarea
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              onChange={(e) => setUpdates({ ...updates, internalComments: e.target.value })}
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