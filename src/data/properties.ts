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
  {
    "id": "p-exact-01",
    "surveyNumber": "P-PAL-100",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Nandur",
    "areaAcres": 10,
    "pricePerGuntha": 1250000,
    "totalPrice": 500000000,
    "coordinates": [
      73.1007,
      19.8021
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 80,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "p-exact-02",
    "surveyNumber": "P-PAL-101",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Kasa",
    "areaAcres": 10,
    "pricePerGuntha": 1100000,
    "totalPrice": 440000000,
    "coordinates": [
      72.9374,
      19.9824
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 90,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "p-panvel-01",
    "surveyNumber": "125/2",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Apta",
    "areaAcres": 1.5,
    "pricePerGuntha": 55000,
    "totalPrice": 3300000,
    "coordinates": [
      73.1327,
      18.8705
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 65,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "p1",
    "surveyNumber": "R-001",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Uppal",
    "areaAcres": 2.5,
    "pricePerGuntha": 50000,
    "totalPrice": 5000000,
    "coordinates": [
      72.9314,
      18.6659
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 45,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "p2",
    "surveyNumber": "R-002",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Kashipur",
    "areaAcres": 1.8,
    "pricePerGuntha": 52000,
    "totalPrice": 3744000,
    "coordinates": [
      73.099,
      18.7418
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "p3",
    "surveyNumber": "P-001",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Dhumal",
    "areaAcres": 3,
    "pricePerGuntha": 48000,
    "totalPrice": 5760000,
    "coordinates": [
      72.9178,
      20.1286
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 80,
    "roadType": "District Road",
    "isDemo": true
  },
  {
    "id": "p4",
    "surveyNumber": "P-002",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Nandur",
    "areaAcres": 2.2,
    "pricePerGuntha": 47000,
    "totalPrice": 4136000,
    "coordinates": [
      73.102,
      19.797
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 210,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "p5",
    "surveyNumber": "R-003",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Kadam",
    "areaAcres": 1.2,
    "pricePerGuntha": 51000,
    "totalPrice": 2448000,
    "coordinates": [
      73.1274,
      18.1222
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 60,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "p6",
    "surveyNumber": "P-003",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Murdadi",
    "areaAcres": 2.7,
    "pricePerGuntha": 46000,
    "totalPrice": 4968000,
    "coordinates": [
      72.8317,
      20.0085
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-101",
    "surveyNumber": "P-VIK-101",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Nandur",
    "areaAcres": 8,
    "pricePerGuntha": 68000,
    "totalPrice": 21760000,
    "coordinates": [
      73.1022,
      19.8015
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-102",
    "surveyNumber": "R-PAN-102",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Wavanje",
    "areaAcres": 4,
    "pricePerGuntha": 250000,
    "totalPrice": 40000000,
    "coordinates": [
      73.1604,
      19.0209
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-103",
    "surveyNumber": "P-DAH-103",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Vangaon",
    "areaAcres": 7.5,
    "pricePerGuntha": 93000,
    "totalPrice": 27900000,
    "coordinates": [
      72.7719,
      19.8994
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-104",
    "surveyNumber": "R-PAN-104",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Dunkur",
    "areaAcres": 10,
    "pricePerGuntha": 750000,
    "totalPrice": 300000000,
    "coordinates": [
      73.1106,
      18.9167
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-105",
    "surveyNumber": "P-VIK-105",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Nandur",
    "areaAcres": 4,
    "pricePerGuntha": 1400000,
    "totalPrice": 224000000,
    "coordinates": [
      73.1013,
      19.8027
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-106",
    "surveyNumber": "R-MHA-106",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Mendadi",
    "areaAcres": 1.5,
    "pricePerGuntha": 88000,
    "totalPrice": 5280000,
    "coordinates": [
      73.0973,
      18.2226
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-107",
    "surveyNumber": "P-TAL-107",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Borigaon",
    "areaAcres": 2.5,
    "pricePerGuntha": 45000,
    "totalPrice": 4500000,
    "coordinates": [
      72.9016,
      20.1849
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-108",
    "surveyNumber": "R-ALI-108",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Mandwa",
    "areaAcres": 1.5,
    "pricePerGuntha": 98000,
    "totalPrice": 5880000,
    "coordinates": [
      72.872,
      18.7982
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-109",
    "surveyNumber": "P-DAH-109",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Vangaon",
    "areaAcres": 3,
    "pricePerGuntha": 49000,
    "totalPrice": 5880000,
    "coordinates": [
      72.7715,
      19.8973
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-110",
    "surveyNumber": "R-ALI-110",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Awas",
    "areaAcres": 4,
    "pricePerGuntha": 111000,
    "totalPrice": 17760000,
    "coordinates": [
      72.8819,
      18.7602
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-111",
    "surveyNumber": "P-VIK-111",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Sakhare",
    "areaAcres": 12,
    "pricePerGuntha": 500000,
    "totalPrice": 240000000,
    "coordinates": [
      73.1411,
      19.8312
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-112",
    "surveyNumber": "R-PEN-112",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Antora",
    "areaAcres": 7.5,
    "pricePerGuntha": 98000,
    "totalPrice": 29400000,
    "coordinates": [
      73.0677,
      18.723
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-113",
    "surveyNumber": "P-WAD-113",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Pali",
    "areaAcres": 8,
    "pricePerGuntha": 114000,
    "totalPrice": 36480000,
    "coordinates": [
      73.1839,
      19.691
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-114",
    "surveyNumber": "R-MHA-114",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Kadam",
    "areaAcres": 10,
    "pricePerGuntha": 250000,
    "totalPrice": 100000000,
    "coordinates": [
      73.1315,
      18.1137
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-115",
    "surveyNumber": "P-WAD-115",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Kudus",
    "areaAcres": 4,
    "pricePerGuntha": 99000,
    "totalPrice": 15840000,
    "coordinates": [
      73.1022,
      19.6196
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-116",
    "surveyNumber": "R-KAR-116",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Neral",
    "areaAcres": 7.5,
    "pricePerGuntha": 74000,
    "totalPrice": 22200000,
    "coordinates": [
      73.3179,
      19.0282
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-117",
    "surveyNumber": "P-DAH-117",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Kasa",
    "areaAcres": 1.2,
    "pricePerGuntha": 73000,
    "totalPrice": 3504000,
    "coordinates": [
      72.9397,
      19.9913
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-118",
    "surveyNumber": "R-KAR-118",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Mangarul",
    "areaAcres": 12,
    "pricePerGuntha": 117000,
    "totalPrice": 56160000,
    "coordinates": [
      73.3527,
      18.8936
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-119",
    "surveyNumber": "P-WAD-119",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Kudus",
    "areaAcres": 6.2,
    "pricePerGuntha": 42000,
    "totalPrice": 10416000,
    "coordinates": [
      73.1008,
      19.6108
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-120",
    "surveyNumber": "R-ALI-120",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Uppal",
    "areaAcres": 2.5,
    "pricePerGuntha": 50000,
    "totalPrice": 5000000,
    "coordinates": [
      72.9231,
      18.6721
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-121",
    "surveyNumber": "P-WAD-121",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Khandpe",
    "areaAcres": 2,
    "pricePerGuntha": 110000,
    "totalPrice": 8800000,
    "coordinates": [
      73.1518,
      19.6462
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-122",
    "surveyNumber": "R-ALI-122",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Nagaon",
    "areaAcres": 10,
    "pricePerGuntha": 65000,
    "totalPrice": 26000000,
    "coordinates": [
      72.9229,
      18.5812
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-123",
    "surveyNumber": "P-TAL-123",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Sambha",
    "areaAcres": 15,
    "pricePerGuntha": 55000,
    "totalPrice": 33000000,
    "coordinates": [
      72.942,
      20.1577
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-124",
    "surveyNumber": "R-ROH-124",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Nagothane",
    "areaAcres": 6.2,
    "pricePerGuntha": 250000,
    "totalPrice": 62000000,
    "coordinates": [
      73.1525,
      18.5326
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-125",
    "surveyNumber": "P-TAL-125",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Dhumal",
    "areaAcres": 5,
    "pricePerGuntha": 1200000,
    "totalPrice": 240000000,
    "coordinates": [
      72.931,
      20.1278
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-126",
    "surveyNumber": "R-ROH-126",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Pingalsai",
    "areaAcres": 2.5,
    "pricePerGuntha": 92000,
    "totalPrice": 9200000,
    "coordinates": [
      73.12,
      18.4826
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-127",
    "surveyNumber": "P-PAL-127",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Satpati",
    "areaAcres": 4.8,
    "pricePerGuntha": 46000,
    "totalPrice": 8832000,
    "coordinates": [
      72.7208,
      19.7249
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-128",
    "surveyNumber": "R-MHA-128",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Kole",
    "areaAcres": 3.5,
    "pricePerGuntha": 53000,
    "totalPrice": 7420000,
    "coordinates": [
      73.169,
      18.1274
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-129",
    "surveyNumber": "P-PAL-129",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Boisar",
    "areaAcres": 3,
    "pricePerGuntha": 49000,
    "totalPrice": 5880000,
    "coordinates": [
      72.7612,
      19.7962
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-130",
    "surveyNumber": "R-PAN-130",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Morbe",
    "areaAcres": 5,
    "pricePerGuntha": 51000,
    "totalPrice": 10200000,
    "coordinates": [
      73.1903,
      18.9188
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-131",
    "surveyNumber": "P-PAL-131",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Satpati",
    "areaAcres": 2.5,
    "pricePerGuntha": 47000,
    "totalPrice": 4700000,
    "coordinates": [
      72.7118,
      19.7337
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-132",
    "surveyNumber": "R-MHA-132",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Lep",
    "areaAcres": 4,
    "pricePerGuntha": 111000,
    "totalPrice": 17760000,
    "coordinates": [
      73.1732,
      18.1759
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-133",
    "surveyNumber": "P-DAH-133",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Murdadi",
    "areaAcres": 6.2,
    "pricePerGuntha": 47000,
    "totalPrice": 11656000,
    "coordinates": [
      72.8204,
      20.0216
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-134",
    "surveyNumber": "R-ROH-134",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Nivi",
    "areaAcres": 2,
    "pricePerGuntha": 1000000,
    "totalPrice": 80000000,
    "coordinates": [
      73.1788,
      18.4666
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-135",
    "surveyNumber": "P-DAH-135",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Kasa",
    "areaAcres": 1.5,
    "pricePerGuntha": 112000,
    "totalPrice": 6720000,
    "coordinates": [
      72.9418,
      19.9925
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-136",
    "surveyNumber": "R-MHA-136",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Kole",
    "areaAcres": 6.2,
    "pricePerGuntha": 80000,
    "totalPrice": 19840000,
    "coordinates": [
      73.1596,
      18.132
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-137",
    "surveyNumber": "P-DAH-137",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Gholvad",
    "areaAcres": 4,
    "pricePerGuntha": 1200000,
    "totalPrice": 192000000,
    "coordinates": [
      72.7334,
      20.0413
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-138",
    "surveyNumber": "R-PAN-138",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Koproli",
    "areaAcres": 6.2,
    "pricePerGuntha": 52000,
    "totalPrice": 12896000,
    "coordinates": [
      73.1302,
      18.9373
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-139",
    "surveyNumber": "P-TAL-139",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Dhumal",
    "areaAcres": 15,
    "pricePerGuntha": 500000,
    "totalPrice": 300000000,
    "coordinates": [
      72.9303,
      20.1373
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-140",
    "surveyNumber": "R-ROH-140",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Nivi",
    "areaAcres": 1.2,
    "pricePerGuntha": 110000,
    "totalPrice": 5280000,
    "coordinates": [
      73.1832,
      18.4713
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-141",
    "surveyNumber": "P-VIK-141",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Nandur",
    "areaAcres": 8,
    "pricePerGuntha": 74000,
    "totalPrice": 23680000,
    "coordinates": [
      73.0965,
      19.7973
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-142",
    "surveyNumber": "R-KAR-142",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Mangarul",
    "areaAcres": 5,
    "pricePerGuntha": 46000,
    "totalPrice": 9200000,
    "coordinates": [
      73.3386,
      18.897
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-143",
    "surveyNumber": "P-VIK-143",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Malwada",
    "areaAcres": 10,
    "pricePerGuntha": 500000,
    "totalPrice": 200000000,
    "coordinates": [
      73.1664,
      19.7882
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-144",
    "surveyNumber": "R-ROH-144",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Kolad",
    "areaAcres": 1.5,
    "pricePerGuntha": 1200000,
    "totalPrice": 72000000,
    "coordinates": [
      73.3384,
      18.425
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-145",
    "surveyNumber": "P-WAD-145",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Khandpe",
    "areaAcres": 4,
    "pricePerGuntha": 500000,
    "totalPrice": 80000000,
    "coordinates": [
      73.1606,
      19.6455
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-146",
    "surveyNumber": "R-ALI-146",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Akshi",
    "areaAcres": 2.5,
    "pricePerGuntha": 85000,
    "totalPrice": 8500000,
    "coordinates": [
      72.9115,
      18.6071
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-147",
    "surveyNumber": "P-DAH-147",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Bordi",
    "areaAcres": 12,
    "pricePerGuntha": 1400000,
    "totalPrice": 672000000,
    "coordinates": [
      72.7518,
      20.1056
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-148",
    "surveyNumber": "R-KAR-148",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Mangarul",
    "areaAcres": 10,
    "pricePerGuntha": 71000,
    "totalPrice": 28400000,
    "coordinates": [
      73.34,
      18.8948
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-149",
    "surveyNumber": "P-VIK-149",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Kev",
    "areaAcres": 2.5,
    "pricePerGuntha": 750000,
    "totalPrice": 75000000,
    "coordinates": [
      73.0842,
      19.7966
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-150",
    "surveyNumber": "R-PAN-150",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Morbe",
    "areaAcres": 2.5,
    "pricePerGuntha": 75000,
    "totalPrice": 7500000,
    "coordinates": [
      73.1942,
      18.9224
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-151",
    "surveyNumber": "P-WAD-151",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Parali",
    "areaAcres": 7.5,
    "pricePerGuntha": 108000,
    "totalPrice": 32400000,
    "coordinates": [
      73.2277,
      19.6779
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-152",
    "surveyNumber": "R-ROH-152",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Dhatav",
    "areaAcres": 1.2,
    "pricePerGuntha": 750000,
    "totalPrice": 36000000,
    "coordinates": [
      73.1398,
      18.4429
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-153",
    "surveyNumber": "P-WAD-153",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Kudus",
    "areaAcres": 4,
    "pricePerGuntha": 64000,
    "totalPrice": 10240000,
    "coordinates": [
      73.1041,
      19.6207
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-154",
    "surveyNumber": "R-ROH-154",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Nagothane",
    "areaAcres": 3.5,
    "pricePerGuntha": 82000,
    "totalPrice": 11480000,
    "coordinates": [
      73.1484,
      18.5395
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-155",
    "surveyNumber": "P-TAL-155",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Borigaon",
    "areaAcres": 3,
    "pricePerGuntha": 81000,
    "totalPrice": 9720000,
    "coordinates": [
      72.912,
      20.1813
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-156",
    "surveyNumber": "R-MHA-156",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Kole",
    "areaAcres": 4,
    "pricePerGuntha": 62000,
    "totalPrice": 9920000,
    "coordinates": [
      73.1586,
      18.1291
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-157",
    "surveyNumber": "P-VIK-157",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Malwada",
    "areaAcres": 3,
    "pricePerGuntha": 1400000,
    "totalPrice": 168000000,
    "coordinates": [
      73.1718,
      19.78
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-158",
    "surveyNumber": "R-MHA-158",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Kole",
    "areaAcres": 2.5,
    "pricePerGuntha": 61000,
    "totalPrice": 6100000,
    "coordinates": [
      73.1587,
      18.1429
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-159",
    "surveyNumber": "P-WAD-159",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Pali",
    "areaAcres": 1.5,
    "pricePerGuntha": 70000,
    "totalPrice": 4200000,
    "coordinates": [
      73.185,
      19.6775
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-160",
    "surveyNumber": "R-PAN-160",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Apta",
    "areaAcres": 2.5,
    "pricePerGuntha": 118000,
    "totalPrice": 11800000,
    "coordinates": [
      73.1281,
      18.8824
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-161",
    "surveyNumber": "P-WAD-161",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Khandpe",
    "areaAcres": 8,
    "pricePerGuntha": 103000,
    "totalPrice": 32960000,
    "coordinates": [
      73.1605,
      19.6391
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-162",
    "surveyNumber": "R-PAN-162",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Dunkur",
    "areaAcres": 4,
    "pricePerGuntha": 1400000,
    "totalPrice": 224000000,
    "coordinates": [
      73.1078,
      18.9174
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-163",
    "surveyNumber": "P-DAH-163",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Murdadi",
    "areaAcres": 4.8,
    "pricePerGuntha": 750000,
    "totalPrice": 144000000,
    "coordinates": [
      72.8275,
      20.0199
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-164",
    "surveyNumber": "R-MHA-164",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Mendadi",
    "areaAcres": 12,
    "pricePerGuntha": 104000,
    "totalPrice": 49920000,
    "coordinates": [
      73.0886,
      18.2097
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-165",
    "surveyNumber": "P-PAL-165",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Satpati",
    "areaAcres": 3,
    "pricePerGuntha": 75000,
    "totalPrice": 9000000,
    "coordinates": [
      72.7134,
      19.7336
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-166",
    "surveyNumber": "R-PEN-166",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Dadarpada",
    "areaAcres": 1.5,
    "pricePerGuntha": 70000,
    "totalPrice": 4200000,
    "coordinates": [
      73.1405,
      18.7183
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-167",
    "surveyNumber": "P-DAH-167",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Bordi",
    "areaAcres": 2.5,
    "pricePerGuntha": 59000,
    "totalPrice": 5900000,
    "coordinates": [
      72.7488,
      20.1114
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-168",
    "surveyNumber": "R-ROH-168",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Pingalsai",
    "areaAcres": 4,
    "pricePerGuntha": 1400000,
    "totalPrice": 224000000,
    "coordinates": [
      73.1215,
      18.4861
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-169",
    "surveyNumber": "P-VIK-169",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Onde",
    "areaAcres": 4,
    "pricePerGuntha": 85000,
    "totalPrice": 13600000,
    "coordinates": [
      73.0717,
      19.8291
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-170",
    "surveyNumber": "R-KAR-170",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Vangani",
    "areaAcres": 10,
    "pricePerGuntha": 68000,
    "totalPrice": 27200000,
    "coordinates": [
      73.3201,
      19.0772
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-171",
    "surveyNumber": "P-PAL-171",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Shirgaon",
    "areaAcres": 7.5,
    "pricePerGuntha": 91000,
    "totalPrice": 27300000,
    "coordinates": [
      72.7224,
      19.707
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-172",
    "surveyNumber": "R-ROH-172",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Kolad",
    "areaAcres": 15,
    "pricePerGuntha": 112000,
    "totalPrice": 67200000,
    "coordinates": [
      73.343,
      18.424
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-173",
    "surveyNumber": "P-PAL-173",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Boisar",
    "areaAcres": 1.2,
    "pricePerGuntha": 81000,
    "totalPrice": 3888000,
    "coordinates": [
      72.7573,
      19.7966
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-174",
    "surveyNumber": "R-PEN-174",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Dadarpada",
    "areaAcres": 3,
    "pricePerGuntha": 100000,
    "totalPrice": 12000000,
    "coordinates": [
      73.1489,
      18.7162
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-175",
    "surveyNumber": "P-VIK-175",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Alonde",
    "areaAcres": 1.2,
    "pricePerGuntha": 71000,
    "totalPrice": 3408000,
    "coordinates": [
      73.1272,
      19.779
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-176",
    "surveyNumber": "R-ALI-176",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Awas",
    "areaAcres": 7.5,
    "pricePerGuntha": 350000,
    "totalPrice": 105000000,
    "coordinates": [
      72.8783,
      18.7607
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-177",
    "surveyNumber": "P-WAD-177",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Posheri",
    "areaAcres": 8,
    "pricePerGuntha": 60000,
    "totalPrice": 19200000,
    "coordinates": [
      73.1382,
      19.7088
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-178",
    "surveyNumber": "R-ROH-178",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Pingalsai",
    "areaAcres": 4,
    "pricePerGuntha": 65000,
    "totalPrice": 10400000,
    "coordinates": [
      73.1227,
      18.4911
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-179",
    "surveyNumber": "P-VIK-179",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Alonde",
    "areaAcres": 10,
    "pricePerGuntha": 116000,
    "totalPrice": 46400000,
    "coordinates": [
      73.126,
      19.7746
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-180",
    "surveyNumber": "R-PAN-180",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Gherasudhagad",
    "areaAcres": 5,
    "pricePerGuntha": 87000,
    "totalPrice": 17400000,
    "coordinates": [
      73.1894,
      18.8657
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-181",
    "surveyNumber": "P-PAL-181",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Satpati",
    "areaAcres": 1.5,
    "pricePerGuntha": 86000,
    "totalPrice": 5160000,
    "coordinates": [
      72.7161,
      19.7264
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-182",
    "surveyNumber": "R-MHA-182",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Deoghar",
    "areaAcres": 8,
    "pricePerGuntha": 74000,
    "totalPrice": 23680000,
    "coordinates": [
      73.1509,
      18.1602
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-183",
    "surveyNumber": "P-PAL-183",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Satpati",
    "areaAcres": 12,
    "pricePerGuntha": 74000,
    "totalPrice": 35520000,
    "coordinates": [
      72.715,
      19.7287
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-184",
    "surveyNumber": "R-MHA-184",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Deoghar",
    "areaAcres": 10,
    "pricePerGuntha": 118000,
    "totalPrice": 47200000,
    "coordinates": [
      73.1475,
      18.1518
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-185",
    "surveyNumber": "P-TAL-185",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Zari",
    "areaAcres": 4.8,
    "pricePerGuntha": 1400000,
    "totalPrice": 268800000,
    "coordinates": [
      72.8852,
      20.1206
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-186",
    "surveyNumber": "R-PEN-186",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Amtem",
    "areaAcres": 1.2,
    "pricePerGuntha": 64000,
    "totalPrice": 3072000,
    "coordinates": [
      73.1316,
      18.7717
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-187",
    "surveyNumber": "P-DAH-187",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Vangaon",
    "areaAcres": 4.8,
    "pricePerGuntha": 102000,
    "totalPrice": 19584000,
    "coordinates": [
      72.7723,
      19.8989
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-188",
    "surveyNumber": "R-MHA-188",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Kole",
    "areaAcres": 2.5,
    "pricePerGuntha": 114000,
    "totalPrice": 11400000,
    "coordinates": [
      73.1686,
      18.1273
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-189",
    "surveyNumber": "P-WAD-189",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Pali",
    "areaAcres": 3.5,
    "pricePerGuntha": 74000,
    "totalPrice": 10360000,
    "coordinates": [
      73.1877,
      19.6864
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-190",
    "surveyNumber": "R-PEN-190",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Kashipur",
    "areaAcres": 8,
    "pricePerGuntha": 63000,
    "totalPrice": 20160000,
    "coordinates": [
      73.0965,
      18.742
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-191",
    "surveyNumber": "P-WAD-191",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Posheri",
    "areaAcres": 6.2,
    "pricePerGuntha": 52000,
    "totalPrice": 12896000,
    "coordinates": [
      73.1515,
      19.702
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-192",
    "surveyNumber": "R-PEN-192",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Kashipur",
    "areaAcres": 8,
    "pricePerGuntha": 75000,
    "totalPrice": 24000000,
    "coordinates": [
      73.0919,
      18.7401
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-193",
    "surveyNumber": "P-DAH-193",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Vangaon",
    "areaAcres": 12,
    "pricePerGuntha": 53000,
    "totalPrice": 25440000,
    "coordinates": [
      72.7798,
      19.8987
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-194",
    "surveyNumber": "R-MHA-194",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Lep",
    "areaAcres": 2,
    "pricePerGuntha": 72000,
    "totalPrice": 5760000,
    "coordinates": [
      73.1823,
      18.1818
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-195",
    "surveyNumber": "P-PAL-195",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Manor",
    "areaAcres": 6.2,
    "pricePerGuntha": 46000,
    "totalPrice": 11408000,
    "coordinates": [
      72.9132,
      19.7366
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-196",
    "surveyNumber": "R-ALI-196",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Uppal",
    "areaAcres": 5,
    "pricePerGuntha": 117000,
    "totalPrice": 23400000,
    "coordinates": [
      72.9213,
      18.6622
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-197",
    "surveyNumber": "P-PAL-197",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Satpati",
    "areaAcres": 15,
    "pricePerGuntha": 115000,
    "totalPrice": 69000000,
    "coordinates": [
      72.7131,
      19.7212
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-198",
    "surveyNumber": "R-ROH-198",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Kolad",
    "areaAcres": 10,
    "pricePerGuntha": 350000,
    "totalPrice": 140000000,
    "coordinates": [
      73.3305,
      18.4218
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-199",
    "surveyNumber": "P-WAD-199",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Kudus",
    "areaAcres": 2,
    "pricePerGuntha": 750000,
    "totalPrice": 60000000,
    "coordinates": [
      73.1007,
      19.608
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-200",
    "surveyNumber": "R-PEN-200",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Tambati",
    "areaAcres": 3,
    "pricePerGuntha": 98000,
    "totalPrice": 11760000,
    "coordinates": [
      73.1646,
      18.696
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-201",
    "surveyNumber": "P-WAD-201",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Khandpe",
    "areaAcres": 4,
    "pricePerGuntha": 350000,
    "totalPrice": 56000000,
    "coordinates": [
      73.1502,
      19.6399
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-202",
    "surveyNumber": "R-PAN-202",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Chikhale",
    "areaAcres": 10,
    "pricePerGuntha": 112000,
    "totalPrice": 44800000,
    "coordinates": [
      73.1601,
      18.9811
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-203",
    "surveyNumber": "P-TAL-203",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Sambha",
    "areaAcres": 3,
    "pricePerGuntha": 103000,
    "totalPrice": 12360000,
    "coordinates": [
      72.9381,
      20.1616
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-204",
    "surveyNumber": "R-PEN-204",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Amtem",
    "areaAcres": 3,
    "pricePerGuntha": 350000,
    "totalPrice": 42000000,
    "coordinates": [
      73.1192,
      18.7584
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-205",
    "surveyNumber": "P-VIK-205",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Alonde",
    "areaAcres": 12,
    "pricePerGuntha": 45000,
    "totalPrice": 21600000,
    "coordinates": [
      73.1215,
      19.7732
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-206",
    "surveyNumber": "R-MHA-206",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Lep",
    "areaAcres": 2,
    "pricePerGuntha": 95000,
    "totalPrice": 7600000,
    "coordinates": [
      73.1722,
      18.1712
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-207",
    "surveyNumber": "P-TAL-207",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Sambha",
    "areaAcres": 3.5,
    "pricePerGuntha": 53000,
    "totalPrice": 7420000,
    "coordinates": [
      72.9452,
      20.1619
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-208",
    "surveyNumber": "R-PEN-208",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Tambati",
    "areaAcres": 4,
    "pricePerGuntha": 110000,
    "totalPrice": 17600000,
    "coordinates": [
      73.1644,
      18.6945
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-209",
    "surveyNumber": "P-VIK-209",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Kev",
    "areaAcres": 12,
    "pricePerGuntha": 40000,
    "totalPrice": 19200000,
    "coordinates": [
      73.0813,
      19.7904
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-210",
    "surveyNumber": "R-ALI-210",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Nagaon",
    "areaAcres": 3.5,
    "pricePerGuntha": 103000,
    "totalPrice": 14420000,
    "coordinates": [
      72.9108,
      18.5875
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-211",
    "surveyNumber": "P-WAD-211",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Khandpe",
    "areaAcres": 15,
    "pricePerGuntha": 102000,
    "totalPrice": 61200000,
    "coordinates": [
      73.1544,
      19.653
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-212",
    "surveyNumber": "R-ALI-212",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Akshi",
    "areaAcres": 2,
    "pricePerGuntha": 41000,
    "totalPrice": 3280000,
    "coordinates": [
      72.8994,
      18.6213
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-213",
    "surveyNumber": "P-VIK-213",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Alonde",
    "areaAcres": 12,
    "pricePerGuntha": 1200000,
    "totalPrice": 576000000,
    "coordinates": [
      73.1276,
      19.7809
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-214",
    "surveyNumber": "R-MHA-214",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Turumbadi",
    "areaAcres": 2.5,
    "pricePerGuntha": 58000,
    "totalPrice": 5800000,
    "coordinates": [
      73.1396,
      18.1802
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-215",
    "surveyNumber": "P-DAH-215",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Murdadi",
    "areaAcres": 3,
    "pricePerGuntha": 93000,
    "totalPrice": 11160000,
    "coordinates": [
      72.8174,
      20.0167
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-216",
    "surveyNumber": "R-PAN-216",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Gherasudhagad",
    "areaAcres": 8,
    "pricePerGuntha": 115000,
    "totalPrice": 36800000,
    "coordinates": [
      73.1837,
      18.8636
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-217",
    "surveyNumber": "P-WAD-217",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Parali",
    "areaAcres": 3.5,
    "pricePerGuntha": 109000,
    "totalPrice": 15260000,
    "coordinates": [
      73.2223,
      19.6675
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-218",
    "surveyNumber": "R-ALI-218",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Nagaon",
    "areaAcres": 4,
    "pricePerGuntha": 1400000,
    "totalPrice": 224000000,
    "coordinates": [
      72.9072,
      18.5924
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-219",
    "surveyNumber": "P-PAL-219",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Satpati",
    "areaAcres": 7.5,
    "pricePerGuntha": 59000,
    "totalPrice": 17700000,
    "coordinates": [
      72.7111,
      19.7354
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-220",
    "surveyNumber": "R-PEN-220",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Kashipur",
    "areaAcres": 12,
    "pricePerGuntha": 52000,
    "totalPrice": 24960000,
    "coordinates": [
      73.0945,
      18.7526
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-221",
    "surveyNumber": "P-PAL-221",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Mahim",
    "areaAcres": 2,
    "pricePerGuntha": 1400000,
    "totalPrice": 112000000,
    "coordinates": [
      72.7474,
      19.6726
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-222",
    "surveyNumber": "R-KAR-222",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Neral",
    "areaAcres": 12,
    "pricePerGuntha": 108000,
    "totalPrice": 51840000,
    "coordinates": [
      73.3244,
      19.0318
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-223",
    "surveyNumber": "P-PAL-223",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Kelva",
    "areaAcres": 1.2,
    "pricePerGuntha": 70000,
    "totalPrice": 3360000,
    "coordinates": [
      72.7367,
      19.6311
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-224",
    "surveyNumber": "R-PAN-224",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Koproli",
    "areaAcres": 1.5,
    "pricePerGuntha": 52000,
    "totalPrice": 3120000,
    "coordinates": [
      73.1274,
      18.9442
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-225",
    "surveyNumber": "P-TAL-225",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Dhumal",
    "areaAcres": 3,
    "pricePerGuntha": 95000,
    "totalPrice": 11400000,
    "coordinates": [
      72.93,
      20.1351
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-226",
    "surveyNumber": "R-ALI-226",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Varsoli",
    "areaAcres": 2,
    "pricePerGuntha": 1400000,
    "totalPrice": 112000000,
    "coordinates": [
      72.8792,
      18.6689
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-227",
    "surveyNumber": "P-DAH-227",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Bordi",
    "areaAcres": 4.8,
    "pricePerGuntha": 98000,
    "totalPrice": 18816000,
    "coordinates": [
      72.752,
      20.105
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-228",
    "surveyNumber": "R-PEN-228",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Tambati",
    "areaAcres": 5,
    "pricePerGuntha": 750000,
    "totalPrice": 150000000,
    "coordinates": [
      73.1611,
      18.6909
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-229",
    "surveyNumber": "P-PAL-229",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Mahim",
    "areaAcres": 3,
    "pricePerGuntha": 78000,
    "totalPrice": 9360000,
    "coordinates": [
      72.742,
      19.6684
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-230",
    "surveyNumber": "R-ALI-230",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Awas",
    "areaAcres": 6.2,
    "pricePerGuntha": 77000,
    "totalPrice": 19096000,
    "coordinates": [
      72.8898,
      18.7594
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-231",
    "surveyNumber": "P-TAL-231",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Dhumal",
    "areaAcres": 6.2,
    "pricePerGuntha": 46000,
    "totalPrice": 11408000,
    "coordinates": [
      72.9203,
      20.1383
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 85,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-232",
    "surveyNumber": "R-ALI-232",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Nagaon",
    "areaAcres": 10,
    "pricePerGuntha": 64000,
    "totalPrice": 25600000,
    "coordinates": [
      72.9131,
      18.5875
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-233",
    "surveyNumber": "P-DAH-233",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Vangaon",
    "areaAcres": 1.5,
    "pricePerGuntha": 45000,
    "totalPrice": 2700000,
    "coordinates": [
      72.782,
      19.8996
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-234",
    "surveyNumber": "R-KAR-234",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Kashele",
    "areaAcres": 1.5,
    "pricePerGuntha": 81000,
    "totalPrice": 4860000,
    "coordinates": [
      73.411,
      18.9863
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-235",
    "surveyNumber": "P-WAD-235",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Pali",
    "areaAcres": 5,
    "pricePerGuntha": 74000,
    "totalPrice": 14800000,
    "coordinates": [
      73.1815,
      19.6803
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-236",
    "surveyNumber": "R-PEN-236",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Tambati",
    "areaAcres": 12,
    "pricePerGuntha": 54000,
    "totalPrice": 25920000,
    "coordinates": [
      73.1722,
      18.6877
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-237",
    "surveyNumber": "P-PAL-237",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Kelva",
    "areaAcres": 3.5,
    "pricePerGuntha": 750000,
    "totalPrice": 105000000,
    "coordinates": [
      72.7387,
      19.6184
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-238",
    "surveyNumber": "R-KAR-238",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Mangarul",
    "areaAcres": 6.2,
    "pricePerGuntha": 87000,
    "totalPrice": 21576000,
    "coordinates": [
      73.3401,
      18.8921
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-239",
    "surveyNumber": "P-WAD-239",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Pali",
    "areaAcres": 15,
    "pricePerGuntha": 48000,
    "totalPrice": 28800000,
    "coordinates": [
      73.1855,
      19.6782
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-240",
    "surveyNumber": "R-KAR-240",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Bhivpuri",
    "areaAcres": 1.5,
    "pricePerGuntha": 250000,
    "totalPrice": 15000000,
    "coordinates": [
      73.31,
      18.9717
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-241",
    "surveyNumber": "P-WAD-241",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Khandpe",
    "areaAcres": 4,
    "pricePerGuntha": 109000,
    "totalPrice": 17440000,
    "coordinates": [
      73.1627,
      19.6511
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-242",
    "surveyNumber": "R-KAR-242",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Neral",
    "areaAcres": 12,
    "pricePerGuntha": 92000,
    "totalPrice": 44160000,
    "coordinates": [
      73.3217,
      19.0173
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-243",
    "surveyNumber": "P-DAH-243",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Kasa",
    "areaAcres": 4.8,
    "pricePerGuntha": 86000,
    "totalPrice": 16512000,
    "coordinates": [
      72.9306,
      19.9854
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-244",
    "surveyNumber": "R-PEN-244",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Kashipur",
    "areaAcres": 4,
    "pricePerGuntha": 55000,
    "totalPrice": 8800000,
    "coordinates": [
      73.0971,
      18.7377
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-245",
    "surveyNumber": "P-DAH-245",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Vangaon",
    "areaAcres": 7.5,
    "pricePerGuntha": 42000,
    "totalPrice": 12600000,
    "coordinates": [
      72.7733,
      19.9013
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-246",
    "surveyNumber": "R-ROH-246",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Nagothane",
    "areaAcres": 1.5,
    "pricePerGuntha": 110000,
    "totalPrice": 6600000,
    "coordinates": [
      73.1504,
      18.5423
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-247",
    "surveyNumber": "P-DAH-247",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Chinchani",
    "areaAcres": 1.2,
    "pricePerGuntha": 58000,
    "totalPrice": 2784000,
    "coordinates": [
      72.7044,
      19.8678
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-248",
    "surveyNumber": "R-PAN-248",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Morbe",
    "areaAcres": 12,
    "pricePerGuntha": 250000,
    "totalPrice": 120000000,
    "coordinates": [
      73.1896,
      18.9203
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-249",
    "surveyNumber": "P-VIK-249",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Sakhare",
    "areaAcres": 3,
    "pricePerGuntha": 1200000,
    "totalPrice": 144000000,
    "coordinates": [
      73.1355,
      19.8299
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-250",
    "surveyNumber": "R-MHA-250",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Lep",
    "areaAcres": 5,
    "pricePerGuntha": 97000,
    "totalPrice": 19400000,
    "coordinates": [
      73.1796,
      18.1702
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-251",
    "surveyNumber": "P-WAD-251",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Pali",
    "areaAcres": 4.8,
    "pricePerGuntha": 43000,
    "totalPrice": 8256000,
    "coordinates": [
      73.193,
      19.6852
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-252",
    "surveyNumber": "R-KAR-252",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Neral",
    "areaAcres": 4.8,
    "pricePerGuntha": 96000,
    "totalPrice": 18432000,
    "coordinates": [
      73.3245,
      19.0308
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-253",
    "surveyNumber": "P-VIK-253",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Sakhare",
    "areaAcres": 3,
    "pricePerGuntha": 114000,
    "totalPrice": 13680000,
    "coordinates": [
      73.145,
      19.8275
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-254",
    "surveyNumber": "R-PEN-254",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Dadarpada",
    "areaAcres": 5,
    "pricePerGuntha": 52000,
    "totalPrice": 10400000,
    "coordinates": [
      73.1486,
      18.7075
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-255",
    "surveyNumber": "P-WAD-255",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Khandpe",
    "areaAcres": 4,
    "pricePerGuntha": 69000,
    "totalPrice": 11040000,
    "coordinates": [
      73.1537,
      19.637
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-256",
    "surveyNumber": "R-KAR-256",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Neral",
    "areaAcres": 3.5,
    "pricePerGuntha": 72000,
    "totalPrice": 10080000,
    "coordinates": [
      73.314,
      19.018
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-257",
    "surveyNumber": "P-VIK-257",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Nandur",
    "areaAcres": 1.5,
    "pricePerGuntha": 87000,
    "totalPrice": 5220000,
    "coordinates": [
      73.0996,
      19.799
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-258",
    "surveyNumber": "R-ROH-258",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Dhatav",
    "areaAcres": 7.5,
    "pricePerGuntha": 500000,
    "totalPrice": 150000000,
    "coordinates": [
      73.1298,
      18.4482
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 120,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-259",
    "surveyNumber": "P-VIK-259",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Malwada",
    "areaAcres": 6.2,
    "pricePerGuntha": 53000,
    "totalPrice": 13144000,
    "coordinates": [
      73.1629,
      19.7889
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-260",
    "surveyNumber": "R-ALI-260",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Mandwa",
    "areaAcres": 1.5,
    "pricePerGuntha": 111000,
    "totalPrice": 6660000,
    "coordinates": [
      72.8732,
      18.8013
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-261",
    "surveyNumber": "P-PAL-261",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Kelva",
    "areaAcres": 10,
    "pricePerGuntha": 118000,
    "totalPrice": 47200000,
    "coordinates": [
      72.726,
      19.6208
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-262",
    "surveyNumber": "R-KAR-262",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Mangarul",
    "areaAcres": 1.2,
    "pricePerGuntha": 1200000,
    "totalPrice": 57600000,
    "coordinates": [
      73.3443,
      18.8993
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-263",
    "surveyNumber": "P-DAH-263",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Bordi",
    "areaAcres": 6.2,
    "pricePerGuntha": 48000,
    "totalPrice": 11904000,
    "coordinates": [
      72.7444,
      20.1024
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-264",
    "surveyNumber": "R-KAR-264",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Vangani",
    "areaAcres": 2.5,
    "pricePerGuntha": 98000,
    "totalPrice": 9800000,
    "coordinates": [
      73.3218,
      19.0846
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-265",
    "surveyNumber": "P-WAD-265",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Posheri",
    "areaAcres": 1.5,
    "pricePerGuntha": 59000,
    "totalPrice": 3540000,
    "coordinates": [
      73.15,
      19.7061
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-266",
    "surveyNumber": "R-PEN-266",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Dadarpada",
    "areaAcres": 7.5,
    "pricePerGuntha": 117000,
    "totalPrice": 35100000,
    "coordinates": [
      73.1463,
      18.7113
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-267",
    "surveyNumber": "P-VIK-267",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Malwada",
    "areaAcres": 4,
    "pricePerGuntha": 1200000,
    "totalPrice": 192000000,
    "coordinates": [
      73.169,
      19.776
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-268",
    "surveyNumber": "R-PAN-268",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Chikhale",
    "areaAcres": 4,
    "pricePerGuntha": 47000,
    "totalPrice": 7520000,
    "coordinates": [
      73.1551,
      18.9753
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-269",
    "surveyNumber": "P-DAH-269",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Gholvad",
    "areaAcres": 3,
    "pricePerGuntha": 40000,
    "totalPrice": 4800000,
    "coordinates": [
      72.7378,
      20.0424
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-270",
    "surveyNumber": "R-ROH-270",
    "district": "Raigad",
    "taluka": "Roha",
    "village": "Nagothane",
    "areaAcres": 5,
    "pricePerGuntha": 85000,
    "totalPrice": 17000000,
    "coordinates": [
      73.1434,
      18.5292
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-271",
    "surveyNumber": "P-VIK-271",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Kev",
    "areaAcres": 15,
    "pricePerGuntha": 500000,
    "totalPrice": 300000000,
    "coordinates": [
      73.078,
      19.796
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-272",
    "surveyNumber": "R-MHA-272",
    "district": "Raigad",
    "taluka": "Mhasala",
    "village": "Lep",
    "areaAcres": 1.5,
    "pricePerGuntha": 81000,
    "totalPrice": 4860000,
    "coordinates": [
      73.1751,
      18.1731
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-273",
    "surveyNumber": "P-TAL-273",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Dhumal",
    "areaAcres": 4,
    "pricePerGuntha": 71000,
    "totalPrice": 11360000,
    "coordinates": [
      72.9326,
      20.1358
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-274",
    "surveyNumber": "R-PEN-274",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Tambati",
    "areaAcres": 3.5,
    "pricePerGuntha": 1400000,
    "totalPrice": 196000000,
    "coordinates": [
      73.1687,
      18.687
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-275",
    "surveyNumber": "P-WAD-275",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Khandpe",
    "areaAcres": 15,
    "pricePerGuntha": 84000,
    "totalPrice": 50400000,
    "coordinates": [
      73.1534,
      19.6371
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-276",
    "surveyNumber": "R-PAN-276",
    "district": "Raigad",
    "taluka": "Panvel",
    "village": "Chikhale",
    "areaAcres": 3,
    "pricePerGuntha": 1000000,
    "totalPrice": 120000000,
    "coordinates": [
      73.1533,
      18.972
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 40,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-277",
    "surveyNumber": "P-PAL-277",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Satpati",
    "areaAcres": 10,
    "pricePerGuntha": 114000,
    "totalPrice": 45600000,
    "coordinates": [
      72.7104,
      19.732
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-278",
    "surveyNumber": "R-KAR-278",
    "district": "Raigad",
    "taluka": "Karjat",
    "village": "Vangani",
    "areaAcres": 3.5,
    "pricePerGuntha": 120000,
    "totalPrice": 16800000,
    "coordinates": [
      73.3358,
      19.0905
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Village Road (Tar)",
    "isDemo": true
  },
  {
    "id": "prop-279",
    "surveyNumber": "P-TAL-279",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Sutrakar",
    "areaAcres": 6.2,
    "pricePerGuntha": 1000000,
    "totalPrice": 248000000,
    "coordinates": [
      72.9136,
      20.1101
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 25,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-280",
    "surveyNumber": "R-PEN-280",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Bhogeshwar",
    "areaAcres": 1.5,
    "pricePerGuntha": 51000,
    "totalPrice": 3060000,
    "coordinates": [
      73.1123,
      18.7385
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-281",
    "surveyNumber": "P-WAD-281",
    "district": "Palghar",
    "taluka": "Wada",
    "village": "Kudus",
    "areaAcres": 4.8,
    "pricePerGuntha": 113000,
    "totalPrice": 21696000,
    "coordinates": [
      73.1104,
      19.6161
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 150,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-282",
    "surveyNumber": "R-ALI-282",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Uppal",
    "areaAcres": 4.8,
    "pricePerGuntha": 1400000,
    "totalPrice": 268800000,
    "coordinates": [
      72.9249,
      18.6623
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-283",
    "surveyNumber": "P-DAH-283",
    "district": "Palghar",
    "taluka": "Dahanu",
    "village": "Murdadi",
    "areaAcres": 2.5,
    "pricePerGuntha": 96000,
    "totalPrice": 9600000,
    "coordinates": [
      72.8201,
      20.0179
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-284",
    "surveyNumber": "R-PEN-284",
    "district": "Raigad",
    "taluka": "Pen",
    "village": "Dadarpada",
    "areaAcres": 4,
    "pricePerGuntha": 116000,
    "totalPrice": 18560000,
    "coordinates": [
      73.1391,
      18.7117
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 95,
    "roadType": "National Highway 48 Feeder",
    "isDemo": true
  },
  {
    "id": "prop-285",
    "surveyNumber": "P-TAL-285",
    "district": "Palghar",
    "taluka": "Talasari",
    "village": "Dhumal",
    "areaAcres": 5,
    "pricePerGuntha": 76000,
    "totalPrice": 15200000,
    "coordinates": [
      72.9314,
      20.1283
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 220,
    "roadType": "Kaccha / Farm Track",
    "isDemo": true
  },
  {
    "id": "prop-286",
    "surveyNumber": "R-ALI-286",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Kihim",
    "areaAcres": 1.5,
    "pricePerGuntha": 58000,
    "totalPrice": 3480000,
    "coordinates": [
      72.888,
      18.7305
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 350,
    "roadType": "Coastal Road",
    "isDemo": true
  },
  {
    "id": "prop-287",
    "surveyNumber": "P-PAL-287",
    "district": "Palghar",
    "taluka": "Palghar",
    "village": "Boisar",
    "areaAcres": 6.2,
    "pricePerGuntha": 50000,
    "totalPrice": 12400000,
    "coordinates": [
      72.761,
      19.8034
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 800,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-288",
    "surveyNumber": "R-ALI-288",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Akshi",
    "areaAcres": 8,
    "pricePerGuntha": 107000,
    "totalPrice": 34240000,
    "coordinates": [
      72.9069,
      18.6094
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 180,
    "roadType": "Major District Road (MDR)",
    "isDemo": true
  },
  {
    "id": "prop-289",
    "surveyNumber": "P-VIK-289",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Malwada",
    "areaAcres": 3,
    "pricePerGuntha": 350000,
    "totalPrice": 42000000,
    "coordinates": [
      73.1611,
      19.7745
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 70,
    "roadType": "Paved State Highway",
    "isDemo": true
  },
  {
    "id": "prop-290",
    "surveyNumber": "R-ALI-290",
    "district": "Raigad",
    "taluka": "Alibag",
    "village": "Varsoli",
    "areaAcres": 1.5,
    "pricePerGuntha": 52000,
    "totalPrice": 3120000,
    "coordinates": [
      72.8795,
      18.6644
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 500,
    "roadType": "Paved Approach Road",
    "isDemo": true
  },
  {
    "id": "prop-291",
    "surveyNumber": "P-VIK-291",
    "district": "Palghar",
    "taluka": "Vikramgad",
    "village": "Alonde",
    "areaAcres": 3.5,
    "pricePerGuntha": 119000,
    "totalPrice": 16660000,
    "coordinates": [
      73.1178,
      19.7703
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Paved State Highway",
    "isDemo": true
  }
];
