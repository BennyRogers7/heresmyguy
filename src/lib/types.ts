export interface Plumber {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  website: string | null;
  services: string[];
  email: string | null;
  rating: number | null;
  slug: string;
  isFeatured: boolean;
  isVerified: boolean;
}

export interface City {
  name: string;
  slug: string;
  count: number;
}

export interface Service {
  name: string;
  slug: string;
  description: string;
}

export const SERVICES: Service[] = [
  { name: "Emergency Plumbing", slug: "emergency-plumbing", description: "24/7 emergency plumbing services for urgent repairs" },
  { name: "Drain Cleaning", slug: "drain-cleaning", description: "Professional drain cleaning and clog removal" },
  { name: "Water Heater Installation & Repair", slug: "water-heater", description: "Water heater installation, repair, and replacement" },
  { name: "Sewer Line Repair", slug: "sewer-line-repair", description: "Sewer line inspection, repair, and replacement" },
  { name: "Pipe Repair & Replacement", slug: "pipe-repair", description: "Pipe repair, replacement, and repiping services" },
  { name: "Bathroom Plumbing", slug: "bathroom-plumbing", description: "Bathroom plumbing installation and repairs" },
  { name: "Kitchen Plumbing", slug: "kitchen-plumbing", description: "Kitchen sink, disposal, and dishwasher plumbing" },
  { name: "Water Softener Installation", slug: "water-softener", description: "Water softener and filtration system installation" },
  { name: "Leak Detection & Repair", slug: "leak-detection", description: "Professional leak detection and repair services" },
  { name: "Toilet Repair & Installation", slug: "toilet-repair", description: "Toilet repair, replacement, and installation" },
];

// Chat-related types
export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export interface UserIntent {
  issue?: string;
  isEmergency?: boolean;
  city?: string;
  citySlug?: string;
}

export type ChatStep =
  | 'welcome'
  | 'emergency'
  | 'location'
  | 'results'
  | 'followup';

export interface ChatState {
  step: ChatStep;
  messages: ChatMessage[];
  intent: UserIntent;
}
