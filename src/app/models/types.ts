export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  lastContact?: Date;
  notes?: string;
  tags?: string[];
}

export interface Lead {
  id: string;
  contactId: string;
  status:
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'proposal'
    | 'negotiation'
    | 'closed';
  value: number;
  description: string;
  createdAt: Date;
  expectedCloseDate?: Date;
  probability?: number;
  assignedTo?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  relatedTo?: {
    type: 'contact' | 'lead' | 'deal' | 'meeting';
    id: string;
  };
}

export interface SalesMetrics {
  totalRevenue: number;
  totalDeals: number;
  averageDealSize: number;
  conversionRate: number;
  pipelineValue: number;
}

export interface EmailActivity {
  id: string;
  contactId: string;
  subject: string;
  sentAt: Date;
  status: 'sent' | 'opened' | 'clicked';
  type: 'outbound' | 'inbound';
}

export interface Meeting {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}
