export type ProspectStatus =
  | 'to_reach_out' | 'contacted' | 'replied' | 'meeting_scheduled' | 'met' | 'not_interested';
export type Priority = 'high' | 'medium' | 'low';
export type Category = 'dancer' | 'actor' | 'choreographer' | 'musician' | 'organizer' | 'other';
export type Channel = 'whatsapp' | 'instagram' | 'call' | 'sms';

export const STATUSES: ProspectStatus[] = ['to_reach_out','contacted','replied','meeting_scheduled','met','not_interested'];
export const PRIORITIES: Priority[] = ['high','medium','low'];
export const CATEGORIES: Category[] = ['dancer','actor','choreographer','musician','organizer','other'];
export const CHANNELS: Channel[] = ['whatsapp','instagram','call','sms'];
