import type { Property } from '../data/properties';

export interface PropertyFilterOptions {
  query?: string;
  district?: string; // 'Raigad' | 'Palghar' | ''
  taluka?: string;
  village?: string;
  minArea?: number | '';
  maxPrice?: number | '';
  maxRoadDist?: number | '';
}

// Mapping of Devanagari numerals to Western digits
const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
};

// Common Marathi and Hindi location transliteration synonyms
export const LOCATION_SYNONYMS: Record<string, string> = {
  // Districts
  'पालघर': 'palghar',
  'रायगड': 'raigad',
  'रायगढ़': 'raigad',

  // Talukas
  'डहाणू': 'dahanu',
  'दहाणू': 'dahanu',
  'दहानू': 'dahanu',
  'विक्रमगड': 'vikramgad',
  'विक्रमगढ': 'vikramgad',
  'अलिबाग': 'alibag',
  'अलीबाग': 'alibag',
  'पनवेल': 'panvel',
  'तलासरी': 'talasari',
  'पेण': 'pen',
  'रोहा': 'roha',
  'वाडा': 'wada',
  'कर्जत': 'karjat',
  'म्हसळा': 'mhasala',
  'म्हासला': 'mhasala',

  // Villages
  'नांदूर': 'nandur',
  'नांदुर': 'nandur',
  'कासा': 'kasa',
  'वाणगाव': 'vangaon',
  'वणगाव': 'vangaon',
  'वनगाव': 'vangaon',
  'बोरीगाव': 'borigaon',
  'आपटा': 'apta',
  'उप्पल': 'uppal',
  'काशीपूर': 'kashipur',
  'काशीपुर': 'kashipur',
  'धुमाळ': 'dhumal',
  'धुमाल': 'dhumal',
  'कदम': 'kadam',
  'मुरदाडी': 'murdadi',
  'नागोठणे': 'nagothane',
  'बोईसर': 'boisar',
  'मांडवा': 'mandwa',
  'किहीम': 'kihim',
  'वरसोली': 'varsoli',
  'अक्षी': 'akshi',
  'नागाव': 'nagaon',
  'केळवे': 'kelva',
  'केळवा': 'kelva',
  'माहीम': 'mahim',
  'सातपाटी': 'satpati',
  'चिंचणी': 'chinchani',
  'घोलवड': 'gholvad',
  'बोर्डी': 'bordi',
  'मनोर': 'manor',
  'कुडूस': 'kudus',
  'नेरळ': 'neral',
  'कोलाड': 'kolad',
};

// Generic filler words in queries that should not prevent location matching
const STOP_WORDS = new Set([
  'in',
  'at',
  'near',
  'village',
  'taluka',
  'district',
  'property',
  'properties',
  'land',
  'plot',
  'plots',
  'गाव',
  'तालुका',
  'जिल्हा',
  'शेती',
  'जमीन',
]);

/**
 * Normalizes a raw user query string:
 * - Trims whitespace and collapses multiple spaces
 * - Converts Devanagari numerals (०-९) to Western digits (0-9)
 * - Transliterates Marathi / Hindi location names to canonical English names
 * - Normalizes spacing around survey number separators (/ and -)
 * - Strips common punctuation like commas, quotes, parentheses
 */
export function normalizeSearchQuery(raw: string): string {
  if (!raw) return '';
  let str = raw.trim();

  // Convert Devanagari numerals
  str = str.replace(/[०-९]/g, (d) => DEVANAGARI_DIGITS[d] || d);

  // Substitute known Marathi / Hindi location terms
  for (const [marathiTerm, englishTerm] of Object.entries(LOCATION_SYNONYMS)) {
    const regex = new RegExp(marathiTerm, 'gi');
    str = str.replace(regex, ` ${englishTerm} `);
  }

  // Strip punctuation that is not part of survey numbers
  str = str.replace(/[,;:!?'"()\[\]{}]/g, ' ');

  // Collapse spaces around slashes and dashes for survey numbers (e.g. 125 / 2 -> 125/2, P - PAL - 100 -> P-PAL-100)
  str = str.replace(/\s*\/\s*/g, '/');
  str = str.replace(/\s*-\s*/g, '-');

  // Convert to lowercase and normalize spaces
  return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Extracts effective search tokens from a normalized query.
 * Filters out generic stop words unless all tokens are stop words.
 */
export function extractSearchTokens(normalizedQuery: string): string[] {
  if (!normalizedQuery) return [];
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const withoutStopWords = tokens.filter((t) => !STOP_WORDS.has(t));
  return withoutStopWords.length > 0 ? withoutStopWords : tokens;
}

/**
 * Centralized filtering pipeline for LandLens AI properties.
 * Applies text search (village, taluka, district, survey number, property ID)
 * and optional structured filters (district, taluka, village, minArea, maxPrice, maxRoadDist).
 *
 * Used identically across:
 * - Explore Map View
 * - Explore List View
 * - Map Markers
 * - Map Bounds Auto-Focus
 * - Listing Count
 */
export function filterProperties(
  allProperties: Property[],
  options: PropertyFilterOptions = {}
): Property[] {
  const {
    query = '',
    district = '',
    taluka = '',
    village = '',
    minArea = '',
    maxPrice = '',
    maxRoadDist = '',
  } = options;

  const normalized = normalizeSearchQuery(query);

  // Check if query is an exact match for a survey number or property ID
  const isExactSurveyQuery =
    Boolean(normalized) &&
    allProperties.some(
      (p) =>
        p.surveyNumber.toLowerCase() === normalized ||
        p.id.toLowerCase() === normalized
    );

  const tokens = isExactSurveyQuery ? [] : extractSearchTokens(normalized);

  return allProperties.filter((p) => {
    // 1. Structured filters
    if (district && p.district.toLowerCase() !== district.toLowerCase()) {
      return false;
    }
    if (taluka && p.taluka.toLowerCase() !== taluka.toLowerCase()) {
      return false;
    }
    if (village && p.village.toLowerCase() !== village.toLowerCase()) {
      return false;
    }
    if (minArea !== '' && p.areaAcres < Number(minArea)) {
      return false;
    }
    if (maxPrice !== '' && p.totalPrice > Number(maxPrice)) {
      return false;
    }
    if (
      maxRoadDist !== '' &&
      p.roadDistanceMeters &&
      p.roadDistanceMeters > Number(maxRoadDist)
    ) {
      return false;
    }

    // 2. Text Search Query
    if (!normalized) {
      return true;
    }

    // Exact Survey Number / ID match
    if (isExactSurveyQuery) {
      return (
        p.surveyNumber.toLowerCase() === normalized ||
        p.id.toLowerCase() === normalized
      );
    }

    // Multi-token combined search: every token must match a location attribute
    const villageLower = p.village.toLowerCase();
    const talukaLower = p.taluka.toLowerCase();
    const districtLower = p.district.toLowerCase();
    const surveyLower = p.surveyNumber.toLowerCase();
    const idLower = p.id.toLowerCase();

    return tokens.every((token) => {
      return (
        villageLower === token ||
        talukaLower === token ||
        districtLower === token ||
        surveyLower === token ||
        idLower === token
      );
    });
  });
}
