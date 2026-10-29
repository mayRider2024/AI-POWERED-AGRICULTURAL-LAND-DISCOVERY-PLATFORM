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
  roadDistanceMeters?: number;
  roadType?: string;
  isDemo?: boolean;
};

export const properties: Property[] = [
  // Raigad sample properties (Strictly Fictional Demo Data)
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
    roadDistanceMeters: 45,
    roadType: 'Paved State Highway',
    isDemo: true,
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
    roadDistanceMeters: 120,
    roadType: 'Village Road (Tar)',
    isDemo: true,
  },
  // Palghar sample properties (Strictly Fictional Demo Data)
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
    roadDistanceMeters: 80,
    roadType: 'District Road',
    isDemo: true,
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
    roadDistanceMeters: 210,
    roadType: 'Kaccha / Farm Track',
    isDemo: true,
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
    roadDistanceMeters: 60,
    roadType: 'Paved Approach Road',
    isDemo: true,
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
    roadDistanceMeters: 95,
    roadType: 'Coastal Road',
    isDemo: true,
  },
  // Panvel demonstration reference property (matches "survey number 125/2 in Panvel")
  {
    id: 'p7',
    surveyNumber: '125/2',
    district: 'Raigad',
    taluka: 'Panvel',
    village: 'Apta',
    areaAcres: 10.0,
    pricePerGuntha: 1250000, // ₹12.5 lakh per guntha (matches "between ₹10 lakh and ₹15 lakh per guntha")
    totalPrice: 500000000, // 10 ac * 40 * 12.5 lakh
    coordinates: [73.11, 18.99],
    verificationStatus: 'unverified',
    roadDistanceMeters: 75, // within 100 metres of a road
    roadType: 'National Highway 48 Feeder',
    isDemo: true,
  },
];
