export interface BrandingConfig {
  brandName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  supportWhatsapp: string;
  primaryColor: string;
  accentColor: string;
  flagshipPrice: number;
  currency: string;
  demoDurationMinutes: number;
  classBatchTargetSize: number;
  classBatchMaxSize: number;
}

export const defaultBranding: BrandingConfig = {
  brandName: 'upspeaq',
  tagline: 'Every Child Deserves the Confidence to Speak',
  contactEmail: 'upspeaqofficial@gmail.com',
  contactPhone: '+91 7004132088',
  supportWhatsapp: '+91 7004132088',
  primaryColor: '#1E293B',
  accentColor: '#D97706',
  flagshipPrice: 4999,
  currency: 'INR',
  demoDurationMinutes: 45,
  classBatchTargetSize: 8,
  classBatchMaxSize: 9,
};
