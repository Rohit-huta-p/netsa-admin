export type ProspectStatus = 'to_reach_out' | 'contacted' | 'replied' | 'meeting_scheduled' | 'met' | 'not_interested';
export type Priority = 'high' | 'medium' | 'low';
export type Category = 'dancer' | 'actor' | 'choreographer' | 'musician' | 'organizer' | 'other';
export type Channel = 'whatsapp' | 'instagram' | 'call' | 'sms';

export interface Note { text: string; by: string; at: string; }
export interface Prospect {
  _id: string;
  name: string;
  category?: Category;
  city: string;
  instagram?: string;
  phone?: string;
  email?: string;
  source?: string;
  priority: Priority;
  status: ProspectStatus;
  assignedTo?: string;
  notes: Note[];
  followUpAt?: string;
  meetingAt?: string;
  lastContactedAt?: string;
  lastChannel?: Channel;
  createdAt: string;
  updatedAt: string;
}
export interface Funnel { byStatus: Partial<Record<ProspectStatus, number>>; dueTodayCount: number; overdueCount: number; }
export interface Template { _id: string; key: string; label: string; channel: string; body: string; }
export interface AdminUser { id: string; email: string; name: string; role: 'owner' | 'member'; }
