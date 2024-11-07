export type Status = 'In Progress' | 'Completed' | 'On Hold' | 'New';

export interface Device {
  id: string;
  serialNumber: string;
  type: string;
  warrantyUntilDate: string;
  errorMessageCustomer: string;
  customerName: string;
  status: Status;
  pointOfError?: string;
  errorAnalysis?: string;
  errorReason?: string;
  internalComments?: string;
  salesforceId: string;
}

export interface Box {
  id: string;
  boxNumber: string;
  status: Status;
  deviceType: string;
  devices: Device[];
  assignedTechnician?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'technician' | 'admin';
  language: 'en' | 'da';
}
