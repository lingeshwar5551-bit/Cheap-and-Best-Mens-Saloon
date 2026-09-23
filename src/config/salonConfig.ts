export interface SalonConfig {
  name: string;
  shortName: string;
  branch: string;
  phone: string;
  phoneFormatted: string;
  address: string;
  fullAddress: string;
  rating: number;
  reviewsCount: number;
  hours: string;
}

export const DEFAULT_SALON_CONFIG: SalonConfig = {
  name: "Cheap & Best Men's Salon",
  shortName: "CHEAP & BEST",
  branch: "Mogappair",
  phone: "073059 53594",
  phoneFormatted: "07305953594",
  address: "2, VOC Street, Road, Mogappair, Chennai, Tamil Nadu 600037",
  fullAddress: "2, VOC Street, Road, Mogappair, Chennai, Tamil Nadu 600037",
  rating: 4.9,
  reviewsCount: 2003,
  hours: "9:00 AM – 10:00 PM Daily",
};
