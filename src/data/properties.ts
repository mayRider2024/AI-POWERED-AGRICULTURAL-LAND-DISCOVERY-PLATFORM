export type Property = {
  id: string;
  surveyNumber: string;
  district: 'Raigad' | 'Palghar';
  taluka: string;
  village: string;
  areaAcres: number;
  pricePerGuntha: number; // local unit price
  totalPrice: number;
  coordinates: [number, number]; // [lng, lat]
  verificationStatus: 'unverified' | 'verified';
};

export const properties: Property[] = [
  // Raigad sample properties
  {
    id: 'p1',
    surveyNumber: 'R-001',
    district: 'Raigad',
    taluka: 'Alibag',
    village: 'Uppal',
    areaAcres: 2.5,
    pricePerGuntha: 50000,
    totalPrice: 5000000, // 2.5 ac * 40 gunthas * ₹50,000 = ₹50,00,000 (₹50 Lakh)
    coordinates: [73.15, 18.6],
    verificationStatus: 'unverified',
  },
  {
    id: 'p2',
    surveyNumber: 'R-002',
    district: 'Raigad',
    taluka: 'Pen',
    village: 'Kashipur',
    areaAcres: 1.8,
    pricePerGuntha: 52000,
    totalPrice: 3744000, // 1.8 ac * 40 gunthas * ₹52,000 = ₹37,44,000 (₹37.44 Lakh)
    coordinates: [73.25, 18.78],
    verificationStatus: 'unverified',
  },
  // Palghar sample properties
  {
    id: 'p3',
    surveyNumber: 'P-001',
    district: 'Palghar',
    taluka: 'Talasari',
    village: 'Dhumal',
    areaAcres: 3.0,
    pricePerGuntha: 48000,
    totalPrice: 5760000, // 3.0 ac * 40 gunthas * ₹48,000 = ₹57,60,000 (₹57.60 Lakh)
    coordinates: [73.05, 19.25],
    verificationStatus: 'unverified',
  },
  {
    id: 'p4',
    surveyNumber: 'P-002',
    district: 'Palghar',
    taluka: 'Vikramgad',
    village: 'Nandur',
    areaAcres: 2.2,
    pricePerGuntha: 47000,
    totalPrice: 4136000, // 2.2 ac * 40 gunthas * ₹47,000 = ₹41,36,000 (₹41.36 Lakh)
    coordinates: [73.12, 19.35],
    verificationStatus: 'unverified',
  },
  {
    id: 'p5',
    surveyNumber: 'R-003',
    district: 'Raigad',
    taluka: 'Mhasala',
    village: 'Kadam',
    areaAcres: 1.2,
    pricePerGuntha: 51000,
    totalPrice: 2448000, // 1.2 ac * 40 gunthas * ₹51,000 = ₹24,48,000 (₹24.48 Lakh)
    coordinates: [73.33, 18.55],
    verificationStatus: 'unverified',
  },
  {
    id: 'p6',
    surveyNumber: 'P-003',
    district: 'Palghar',
    taluka: 'Dahanu',
    village: 'Murdadi',
    areaAcres: 2.7,
    pricePerGuntha: 46000,
    totalPrice: 4968000, // 2.7 ac * 40 gunthas * ₹46,000 = ₹49,68,000 (₹49.68 Lakh)
    coordinates: [72.9, 19.4],
    verificationStatus: 'unverified',
  },
];
