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
    "areaAcres": 10.0,
    "pricePerGuntha": 1250000,
    "totalPrice": 500000000.0,
    "coordinates": [
      73.1205,
      19.3512
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
    "areaAcres": 10.0,
    "pricePerGuntha": 1100000,
    "totalPrice": 440000000.0,
    "coordinates": [
      72.9102,
      19.412
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
    "totalPrice": 3300000.0,
    "coordinates": [
      73.1142,
      18.9912
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
      73.15,
      18.6
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
      73.25,
      18.78
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
    "areaAcres": 3.0,
    "pricePerGuntha": 48000,
    "totalPrice": 5760000,
    "coordinates": [
      73.05,
      19.25
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
      73.12,
      19.35
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
      73.33,
      18.55
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
      72.9,
      19.4
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
    "areaAcres": 8.0,
    "pricePerGuntha": 68000,
    "totalPrice": 21760000,
    "coordinates": [
      72.7115,
      19.1977
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
    "areaAcres": 4.0,
    "pricePerGuntha": 250000,
    "totalPrice": 40000000,
    "coordinates": [
      73.1832,
      18.453
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
      73.0036,
      19.2543
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
    "areaAcres": 10.0,
    "pricePerGuntha": 750000,
    "totalPrice": 300000000,
    "coordinates": [
      72.9733,
      18.5382
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
    "areaAcres": 4.0,
    "pricePerGuntha": 1400000,
    "totalPrice": 224000000,
    "coordinates": [
      72.8087,
      19.3408
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
      73.0559,
      18.3552
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
      73.1138,
      19.5629
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
      73.0989,
      18.745
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
    "areaAcres": 3.0,
    "pricePerGuntha": 49000,
    "totalPrice": 5880000,
    "coordinates": [
      72.7527,
      19.5264
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
    "areaAcres": 4.0,
    "pricePerGuntha": 111000,
    "totalPrice": 17760000,
    "coordinates": [
      73.0746,
      18.4537
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
    "areaAcres": 12.0,
    "pricePerGuntha": 500000,
    "totalPrice": 240000000,
    "coordinates": [
      72.6897,
      19.3808
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
      72.9638,
      18.4
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
    "areaAcres": 8.0,
    "pricePerGuntha": 114000,
    "totalPrice": 36480000,
    "coordinates": [
      72.7816,
      19.3796
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
    "areaAcres": 10.0,
    "pricePerGuntha": 250000,
    "totalPrice": 100000000,
    "coordinates": [
      72.976,
      18.407
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
    "areaAcres": 4.0,
    "pricePerGuntha": 99000,
    "totalPrice": 15840000,
    "coordinates": [
      73.2326,
      19.4704
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
      73.0841,
      18.838
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
      73.1072,
      19.7803
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
    "areaAcres": 12.0,
    "pricePerGuntha": 117000,
    "totalPrice": 56160000,
    "coordinates": [
      73.1043,
      18.4392
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
      72.8678,
      19.1783
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
      73.1716,
      18.36
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
    "areaAcres": 2.0,
    "pricePerGuntha": 110000,
    "totalPrice": 8800000,
    "coordinates": [
      72.9666,
      19.2156
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
    "areaAcres": 10.0,
    "pricePerGuntha": 65000,
    "totalPrice": 26000000,
    "coordinates": [
      73.1194,
      18.7991
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
    "areaAcres": 15.0,
    "pricePerGuntha": 55000,
    "totalPrice": 33000000,
    "coordinates": [
      72.6884,
      19.2735
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
      72.9153,
      18.7955
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
    "areaAcres": 5.0,
    "pricePerGuntha": 1200000,
    "totalPrice": 240000000,
    "coordinates": [
      72.9735,
      19.4398
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
      72.9382,
      18.4333
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
      73.2405,
      19.5714
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
      72.9941,
      18.4741
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
    "areaAcres": 3.0,
    "pricePerGuntha": 49000,
    "totalPrice": 5880000,
    "coordinates": [
      73.1668,
      19.4102
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
    "areaAcres": 5.0,
    "pricePerGuntha": 51000,
    "totalPrice": 10200000,
    "coordinates": [
      73.3892,
      18.9485
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
      72.6513,
      19.2152
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
    "areaAcres": 4.0,
    "pricePerGuntha": 111000,
    "totalPrice": 17760000,
    "coordinates": [
      73.172,
      18.7633
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
      72.6843,
      19.6236
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
    "areaAcres": 2.0,
    "pricePerGuntha": 1000000,
    "totalPrice": 80000000,
    "coordinates": [
      72.9915,
      18.3561
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
      73.0067,
      19.2724
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
      73.0026,
      18.9543
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
    "areaAcres": 4.0,
    "pricePerGuntha": 1200000,
    "totalPrice": 192000000,
    "coordinates": [
      72.8397,
      19.31
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
      73.0079,
      18.3513
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
    "areaAcres": 15.0,
    "pricePerGuntha": 500000,
    "totalPrice": 300000000,
    "coordinates": [
      73.1502,
      19.2104
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
      73.278,
      18.5096
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
    "areaAcres": 8.0,
    "pricePerGuntha": 74000,
    "totalPrice": 23680000,
    "coordinates": [
      72.7764,
      19.2972
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
    "areaAcres": 5.0,
    "pricePerGuntha": 46000,
    "totalPrice": 9200000,
    "coordinates": [
      73.1341,
      18.3646
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
    "areaAcres": 10.0,
    "pricePerGuntha": 500000,
    "totalPrice": 200000000,
    "coordinates": [
      72.9151,
      19.2131
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
      73.2074,
      18.9328
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
    "areaAcres": 4.0,
    "pricePerGuntha": 500000,
    "totalPrice": 80000000,
    "coordinates": [
      73.2099,
      19.3553
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
      73.4105,
      18.8461
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
    "areaAcres": 12.0,
    "pricePerGuntha": 1400000,
    "totalPrice": 672000000,
    "coordinates": [
      73.1788,
      19.6675
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
    "areaAcres": 10.0,
    "pricePerGuntha": 71000,
    "totalPrice": 28400000,
    "coordinates": [
      73.3524,
      18.4868
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
      73.1423,
      19.3448
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
      73.4601,
      18.905
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
      72.6666,
      19.3318
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
      73.3519,
      18.542
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
    "areaAcres": 4.0,
    "pricePerGuntha": 64000,
    "totalPrice": 10240000,
    "coordinates": [
      73.0753,
      19.2783
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
      73.278,
      18.7362
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
    "areaAcres": 3.0,
    "pricePerGuntha": 81000,
    "totalPrice": 9720000,
    "coordinates": [
      72.8274,
      19.3817
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
    "areaAcres": 4.0,
    "pricePerGuntha": 62000,
    "totalPrice": 9920000,
    "coordinates": [
      73.0606,
      18.7309
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
    "areaAcres": 3.0,
    "pricePerGuntha": 1400000,
    "totalPrice": 168000000,
    "coordinates": [
      73.0428,
      19.506
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
      73.0503,
      18.7612
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
      72.7848,
      19.571
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
      72.9237,
      18.8948
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
    "areaAcres": 8.0,
    "pricePerGuntha": 103000,
    "totalPrice": 32960000,
    "coordinates": [
      72.7385,
      19.3798
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
    "areaAcres": 4.0,
    "pricePerGuntha": 1400000,
    "totalPrice": 224000000,
    "coordinates": [
      73.1908,
      18.9706
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
      73.2427,
      19.5673
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
    "areaAcres": 12.0,
    "pricePerGuntha": 104000,
    "totalPrice": 49920000,
    "coordinates": [
      73.4241,
      18.5987
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
    "areaAcres": 3.0,
    "pricePerGuntha": 75000,
    "totalPrice": 9000000,
    "coordinates": [
      72.9628,
      19.6361
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
      73.0718,
      18.4902
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
      72.6885,
      19.5945
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
    "areaAcres": 4.0,
    "pricePerGuntha": 1400000,
    "totalPrice": 224000000,
    "coordinates": [
      73.4229,
      18.5941
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
    "areaAcres": 4.0,
    "pricePerGuntha": 85000,
    "totalPrice": 13600000,
    "coordinates": [
      72.884,
      19.309
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
    "areaAcres": 10.0,
    "pricePerGuntha": 68000,
    "totalPrice": 27200000,
    "coordinates": [
      73.0438,
      18.6418
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
      73.1543,
      19.6069
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
    "areaAcres": 15.0,
    "pricePerGuntha": 112000,
    "totalPrice": 67200000,
    "coordinates": [
      72.9304,
      18.7641
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
      72.8461,
      19.2482
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
    "areaAcres": 3.0,
    "pricePerGuntha": 100000,
    "totalPrice": 12000000,
    "coordinates": [
      73.2037,
      18.3136
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
      72.6622,
      19.2396
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
      73.0337,
      18.6255
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
    "areaAcres": 8.0,
    "pricePerGuntha": 60000,
    "totalPrice": 19200000,
    "coordinates": [
      72.7149,
      19.7753
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
    "areaAcres": 4.0,
    "pricePerGuntha": 65000,
    "totalPrice": 10400000,
    "coordinates": [
      73.2944,
      18.3532
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
    "areaAcres": 10.0,
    "pricePerGuntha": 116000,
    "totalPrice": 46400000,
    "coordinates": [
      73.1277,
      19.6639
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
    "areaAcres": 5.0,
    "pricePerGuntha": 87000,
    "totalPrice": 17400000,
    "coordinates": [
      73.2685,
      18.3483
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
      73.1472,
      19.5449
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
    "areaAcres": 8.0,
    "pricePerGuntha": 74000,
    "totalPrice": 23680000,
    "coordinates": [
      73.4318,
      18.7311
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
    "areaAcres": 12.0,
    "pricePerGuntha": 74000,
    "totalPrice": 35520000,
    "coordinates": [
      72.7973,
      19.3256
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
    "areaAcres": 10.0,
    "pricePerGuntha": 118000,
    "totalPrice": 47200000,
    "coordinates": [
      73.0818,
      18.7677
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
      72.8178,
      19.2808
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
      73.312,
      18.3599
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
      72.6603,
      19.4137
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
      73.2121,
      18.5583
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
      72.7883,
      19.3146
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
    "areaAcres": 8.0,
    "pricePerGuntha": 63000,
    "totalPrice": 20160000,
    "coordinates": [
      73.3232,
      18.4341
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
      72.8277,
      19.6828
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
    "areaAcres": 8.0,
    "pricePerGuntha": 75000,
    "totalPrice": 24000000,
    "coordinates": [
      72.9127,
      18.3319
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
    "areaAcres": 12.0,
    "pricePerGuntha": 53000,
    "totalPrice": 25440000,
    "coordinates": [
      72.9944,
      19.7109
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
    "areaAcres": 2.0,
    "pricePerGuntha": 72000,
    "totalPrice": 5760000,
    "coordinates": [
      73.1666,
      18.9587
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
      73.1367,
      19.2062
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
    "areaAcres": 5.0,
    "pricePerGuntha": 117000,
    "totalPrice": 23400000,
    "coordinates": [
      73.2511,
      18.7173
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
    "areaAcres": 15.0,
    "pricePerGuntha": 115000,
    "totalPrice": 69000000,
    "coordinates": [
      72.8332,
      19.793
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
    "areaAcres": 10.0,
    "pricePerGuntha": 350000,
    "totalPrice": 140000000,
    "coordinates": [
      72.9287,
      18.4853
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
    "areaAcres": 2.0,
    "pricePerGuntha": 750000,
    "totalPrice": 60000000,
    "coordinates": [
      72.9319,
      19.5826
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
    "areaAcres": 3.0,
    "pricePerGuntha": 98000,
    "totalPrice": 11760000,
    "coordinates": [
      73.0201,
      18.3498
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
    "areaAcres": 4.0,
    "pricePerGuntha": 350000,
    "totalPrice": 56000000,
    "coordinates": [
      73.195,
      19.5533
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
    "areaAcres": 10.0,
    "pricePerGuntha": 112000,
    "totalPrice": 44800000,
    "coordinates": [
      73.1435,
      18.9448
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
    "areaAcres": 3.0,
    "pricePerGuntha": 103000,
    "totalPrice": 12360000,
    "coordinates": [
      73.0088,
      19.4064
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
    "areaAcres": 3.0,
    "pricePerGuntha": 350000,
    "totalPrice": 42000000,
    "coordinates": [
      73.3816,
      18.9733
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
    "areaAcres": 12.0,
    "pricePerGuntha": 45000,
    "totalPrice": 21600000,
    "coordinates": [
      72.7551,
      19.6342
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
    "areaAcres": 2.0,
    "pricePerGuntha": 95000,
    "totalPrice": 7600000,
    "coordinates": [
      73.175,
      18.7443
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
      72.8479,
      19.7004
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
    "areaAcres": 4.0,
    "pricePerGuntha": 110000,
    "totalPrice": 17600000,
    "coordinates": [
      72.9328,
      18.3257
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
    "areaAcres": 12.0,
    "pricePerGuntha": 40000,
    "totalPrice": 19200000,
    "coordinates": [
      72.9756,
      19.5604
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
      73.336,
      18.7378
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
    "areaAcres": 15.0,
    "pricePerGuntha": 102000,
    "totalPrice": 61200000,
    "coordinates": [
      73.2339,
      19.185
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
    "areaAcres": 2.0,
    "pricePerGuntha": 41000,
    "totalPrice": 3280000,
    "coordinates": [
      72.9359,
      18.6866
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
    "areaAcres": 12.0,
    "pricePerGuntha": 1200000,
    "totalPrice": 576000000,
    "coordinates": [
      73.0732,
      19.3043
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
      73.4331,
      18.5685
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
    "areaAcres": 3.0,
    "pricePerGuntha": 93000,
    "totalPrice": 11160000,
    "coordinates": [
      73.1226,
      19.3379
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
    "areaAcres": 8.0,
    "pricePerGuntha": 115000,
    "totalPrice": 36800000,
    "coordinates": [
      73.276,
      18.7059
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
      73.2097,
      19.364
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
    "areaAcres": 4.0,
    "pricePerGuntha": 1400000,
    "totalPrice": 224000000,
    "coordinates": [
      73.0709,
      18.5875
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
      72.6722,
      19.4467
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
    "areaAcres": 12.0,
    "pricePerGuntha": 52000,
    "totalPrice": 24960000,
    "coordinates": [
      73.1542,
      18.6682
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
    "areaAcres": 2.0,
    "pricePerGuntha": 1400000,
    "totalPrice": 112000000,
    "coordinates": [
      72.8531,
      19.7784
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
    "areaAcres": 12.0,
    "pricePerGuntha": 108000,
    "totalPrice": 51840000,
    "coordinates": [
      73.07,
      18.566
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
      73.2026,
      19.5418
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
      73.2964,
      18.6106
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
    "areaAcres": 3.0,
    "pricePerGuntha": 95000,
    "totalPrice": 11400000,
    "coordinates": [
      72.9687,
      19.2019
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
    "areaAcres": 2.0,
    "pricePerGuntha": 1400000,
    "totalPrice": 112000000,
    "coordinates": [
      73.2899,
      18.5678
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
      72.6556,
      19.2787
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
    "areaAcres": 5.0,
    "pricePerGuntha": 750000,
    "totalPrice": 150000000,
    "coordinates": [
      73.4726,
      18.9617
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
    "areaAcres": 3.0,
    "pricePerGuntha": 78000,
    "totalPrice": 9360000,
    "coordinates": [
      72.8808,
      19.2395
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
      73.0571,
      18.9949
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
      73.0971,
      19.7374
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
    "areaAcres": 10.0,
    "pricePerGuntha": 64000,
    "totalPrice": 25600000,
    "coordinates": [
      73.2867,
      18.7346
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
      72.9145,
      19.3163
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
      72.9854,
      18.8232
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
    "areaAcres": 5.0,
    "pricePerGuntha": 74000,
    "totalPrice": 14800000,
    "coordinates": [
      72.8042,
      19.6813
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
    "areaAcres": 12.0,
    "pricePerGuntha": 54000,
    "totalPrice": 25920000,
    "coordinates": [
      72.9252,
      18.6278
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
      72.9719,
      19.1097
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
      73.0203,
      18.3758
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
    "areaAcres": 15.0,
    "pricePerGuntha": 48000,
    "totalPrice": 28800000,
    "coordinates": [
      72.9286,
      19.5448
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
      73.1756,
      18.5131
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
    "areaAcres": 4.0,
    "pricePerGuntha": 109000,
    "totalPrice": 17440000,
    "coordinates": [
      73.0954,
      19.3934
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
    "areaAcres": 12.0,
    "pricePerGuntha": 92000,
    "totalPrice": 44160000,
    "coordinates": [
      73.0478,
      18.9573
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
      73.0614,
      19.1695
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
    "areaAcres": 4.0,
    "pricePerGuntha": 55000,
    "totalPrice": 8800000,
    "coordinates": [
      73.3745,
      18.9643
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
      72.8501,
      19.1354
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
      73.0096,
      18.445
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
      72.9741,
      19.7913
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
    "areaAcres": 12.0,
    "pricePerGuntha": 250000,
    "totalPrice": 120000000,
    "coordinates": [
      73.3531,
      18.5508
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
    "areaAcres": 3.0,
    "pricePerGuntha": 1200000,
    "totalPrice": 144000000,
    "coordinates": [
      72.7182,
      19.3947
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
    "areaAcres": 5.0,
    "pricePerGuntha": 97000,
    "totalPrice": 19400000,
    "coordinates": [
      73.4472,
      18.6527
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
      72.9374,
      19.1426
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
      72.9285,
      18.3514
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
    "areaAcres": 3.0,
    "pricePerGuntha": 114000,
    "totalPrice": 13680000,
    "coordinates": [
      72.8451,
      19.4838
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
    "areaAcres": 5.0,
    "pricePerGuntha": 52000,
    "totalPrice": 10400000,
    "coordinates": [
      72.9486,
      18.8552
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
    "areaAcres": 4.0,
    "pricePerGuntha": 69000,
    "totalPrice": 11040000,
    "coordinates": [
      73.1465,
      19.3897
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
      72.9716,
      18.562
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
      72.9838,
      19.6682
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
      73.4447,
      18.9115
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
      72.7776,
      19.5045
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
      73.3376,
      18.5573
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
    "areaAcres": 10.0,
    "pricePerGuntha": 118000,
    "totalPrice": 47200000,
    "coordinates": [
      72.984,
      19.5725
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
      73.4329,
      18.8337
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
      73.0299,
      19.1993
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
      73.102,
      18.5386
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
      73.0207,
      19.2102
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
      73.0439,
      18.6094
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
    "areaAcres": 4.0,
    "pricePerGuntha": 1200000,
    "totalPrice": 192000000,
    "coordinates": [
      72.942,
      19.5749
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
    "areaAcres": 4.0,
    "pricePerGuntha": 47000,
    "totalPrice": 7520000,
    "coordinates": [
      73.0609,
      18.3054
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
    "areaAcres": 3.0,
    "pricePerGuntha": 40000,
    "totalPrice": 4800000,
    "coordinates": [
      72.9084,
      19.4482
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
    "areaAcres": 5.0,
    "pricePerGuntha": 85000,
    "totalPrice": 17000000,
    "coordinates": [
      73.3971,
      18.3505
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
    "areaAcres": 15.0,
    "pricePerGuntha": 500000,
    "totalPrice": 300000000,
    "coordinates": [
      72.994,
      19.503
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
      73.4486,
      18.4203
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
    "areaAcres": 4.0,
    "pricePerGuntha": 71000,
    "totalPrice": 11360000,
    "coordinates": [
      72.8903,
      19.405
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
      73.1863,
      18.4177
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
    "areaAcres": 15.0,
    "pricePerGuntha": 84000,
    "totalPrice": 50400000,
    "coordinates": [
      73.1414,
      19.6092
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
    "areaAcres": 3.0,
    "pricePerGuntha": 1000000,
    "totalPrice": 120000000,
    "coordinates": [
      73.3355,
      18.407
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
    "areaAcres": 10.0,
    "pricePerGuntha": 114000,
    "totalPrice": 45600000,
    "coordinates": [
      73.2045,
      19.4142
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
      73.1439,
      18.5213
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
      72.927,
      19.1519
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
      73.1842,
      18.7305
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
      72.8429,
      19.5563
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
      73.3086,
      18.5404
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
      73.0159,
      19.4668
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
    "areaAcres": 4.0,
    "pricePerGuntha": 116000,
    "totalPrice": 18560000,
    "coordinates": [
      73.2585,
      18.3367
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
    "areaAcres": 5.0,
    "pricePerGuntha": 76000,
    "totalPrice": 15200000,
    "coordinates": [
      73.1609,
      19.2764
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
      73.0661,
      18.9417
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
      72.876,
      19.3167
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
    "areaAcres": 8.0,
    "pricePerGuntha": 107000,
    "totalPrice": 34240000,
    "coordinates": [
      73.2823,
      18.3654
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
    "areaAcres": 3.0,
    "pricePerGuntha": 350000,
    "totalPrice": 42000000,
    "coordinates": [
      73.1097,
      19.3392
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
      73.2039,
      18.6554
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
      72.876,
      19.1917
    ],
    "verificationStatus": "unverified",
    "roadDistanceMeters": 55,
    "roadType": "Paved State Highway",
    "isDemo": true
  }
];
