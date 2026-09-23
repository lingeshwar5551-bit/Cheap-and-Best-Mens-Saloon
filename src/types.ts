export type BarberTool = 'scissors' | 'trimmer' | 'shaver';

export interface HairSection {
  id: string;
  name: string;
  category: 'top' | 'fringe' | 'crown' | 'sides_left' | 'sides_right' | 'nape' | 'burns';
  x: number; // percentage in head canvas
  y: number;
  width: number;
  height: number;
  path: string; // SVG path or polygon
  initialLength: number; // 100
  currentLength: number; // 0 to 100
  isCut: boolean;
  side: 'left' | 'right' | 'center';
}

export type CutResultQuality = 'good' | 'very_good' | 'poor' | null;

export interface CutEvaluation {
  quality: CutResultQuality;
  headline: string;
  message: string;
  symmetryScore: number;
  finishScore: number;
  hairRemovedPct: number;
}

export interface SalonService {
  number: string;
  id: string;
  name: string;
  description: string;
  tag: string;
  iconName: string;
}

export interface SalonReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  highlight?: string;
  isPositive: boolean;
}

export interface BookingFormState {
  fullName: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  barberPreference: string;
  notes?: string;
}
