import { ProspectStatus } from '../types';

export const STATUS_OPTIONS: { value: ProspectStatus; label: string }[] = [
  { value: 'to_reach_out', label: 'To reach out' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'replied', label: 'Replied' },
  { value: 'meeting_scheduled', label: 'Meeting scheduled' },
  { value: 'met', label: 'Met' },
  { value: 'not_interested', label: 'Not interested' },
];
