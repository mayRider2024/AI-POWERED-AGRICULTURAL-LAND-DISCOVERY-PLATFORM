import { properties, type Property } from '../data/properties';

export interface ParsedSearchFilters {
  district: string | null;
  taluka: string | null;
  surveyNumber: string | null;
  exactArea: number | null;
  minArea: number | null;
  minAreaStrict: boolean;
  maxArea: number | null;
  minPricePerGuntha: number | null;
  maxPricePerGuntha: number | null;
  maxTotalPrice: number | null;
  maxRoadDistance: number | null;
  mapIntent: boolean;
  verify712Intent: boolean;
}

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

const TALUKAS_MAP: Record<string, { taluka: string; district: 'Raigad' | 'Palghar' }> = {
  panvel: { taluka: 'Panvel', district: 'Raigad' },
  पनवेल: { taluka: 'Panvel', district: 'Raigad' },
  alibag: { taluka: 'Alibag', district: 'Raigad' },
  alibaug: { taluka: 'Alibag', district: 'Raigad' },
  अलिबाग: { taluka: 'Alibag', district: 'Raigad' },
  अलीबाग: { taluka: 'Alibag', district: 'Raigad' },
  pen: { taluka: 'Pen', district: 'Raigad' },
  पेण: { taluka: 'Pen', district: 'Raigad' },
  mhasala: { taluka: 'Mhasala', district: 'Raigad' },
  म्हसळा: { taluka: 'Mhasala', district: 'Raigad' },
  म्हासला: { taluka: 'Mhasala', district: 'Raigad' },
  roha: { taluka: 'Roha', district: 'Raigad' },
  रोहा: { taluka: 'Roha', district: 'Raigad' },
  karjat: { taluka: 'Karjat', district: 'Raigad' },
  कर्जत: { taluka: 'Karjat', district: 'Raigad' },
  talasari: { taluka: 'Talasari', district: 'Palghar' },
  तलासरी: { taluka: 'Talasari', district: 'Palghar' },
  vikramgad: { taluka: 'Vikramgad', district: 'Palghar' },
  विक्रमगड: { taluka: 'Vikramgad', district: 'Palghar' },
  विक्रमगढ: { taluka: 'Vikramgad', district: 'Palghar' },
  dahanu: { taluka: 'Dahanu', district: 'Palghar' },
  डहाणू: { taluka: 'Dahanu', district: 'Palghar' },
  दहाणू: { taluka: 'Dahanu', district: 'Palghar' },
  दहानू: { taluka: 'Dahanu', district: 'Palghar' },
  wada: { taluka: 'Wada', district: 'Palghar' },
  वाडा: { taluka: 'Wada', district: 'Palghar' },
};

/**
 * Normalizes query string converting Devanagari numerals to standard digits
 */
export function normalizeQueryDigits(query: string): string {
  let str = query.toLowerCase();
  for (const [m, e] of Object.entries(DEVANAGARI_DIGITS)) {
    str = str.replaceAll(m, e);
  }
  return str;
}

/**
 * Deterministically parses natural language land discovery query in English, Marathi, or Hindi.
 */
export function parseSearchQuery(query: string): ParsedSearchFilters {
  const q = normalizeQueryDigits(query);

  // 1. District identification
  let district: string | null = null;
  if (q.includes('raigad') || q.includes('रायगड') || q.includes('रायगढ़')) {
    district = 'Raigad';
  } else if (q.includes('palghar') || q.includes('पालघर')) {
    district = 'Palghar';
  }

  // 2. Taluka identification
  let taluka: string | null = null;
  for (const [key, mapping] of Object.entries(TALUKAS_MAP)) {
    if (q.includes(key)) {
      taluka = mapping.taluka;
      if (!district) {
        district = mapping.district;
      }
      break;
    }
  }

  // 3. Survey / Gat number parsing
  let surveyNumber: string | null = null;
  const surveyMatch = q.match(
    /(?:survey(?:\s*(?:no\.?|number))?|gat(?:\s*(?:no\.?|number))?|सर्व्हे(?:\s*क्र\.?)?|गट(?:\s*क्र\.?)?|सर्वे(?:\s*नंबर)?|खसरा(?:\s*नं\.?)?)\s*[:#-]?\s*([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:\/[0-9]+)?)/i
  );
  if (surveyMatch) {
    surveyNumber = surveyMatch[1].toUpperCase();
  } else {
    const codeMatch = q.match(/\b([rp]-[a-z0-9]+-[0-9]{3}|[rp]-[0-9]{3})\b/i);
    if (codeMatch) surveyNumber = codeMatch[1].toUpperCase();
  }

  // 4. Area (acres / एकर / एकड़)
  let exactArea: number | null = null;
  let minArea: number | null = null;
  let minAreaStrict = false;
  let maxArea: number | null = null;

  const areaUnit = '(?:acres?|acre|एकर|एकड़)';
  const areaRange = q.match(
    new RegExp(`(?:between\\s+)?(\\d+(?:\\.\\d+)?)\\s*(?:-|to|and|ते|से)\\s*(\\d+(?:\\.\\d+)?)\\s*${areaUnit}`)
  );

  if (areaRange) {
    minArea = parseFloat(areaRange[1]);
    maxArea = parseFloat(areaRange[2]);
  } else {
    const areaAtLeast = (
      q.match(
        new RegExp(
          `(?:at\\s+least|minimum(?:\\s+of)?|min\\b|no\\s+less\\s+than|कमीतकमी|कम\\s*से\\s*कम)\\s*(\\d+(?:\\.\\d+)?)\\s*[-]?\\s*${areaUnit}`
        )
      ) ||
      q.match(
        new RegExp(
          `(\\d+(?:\\.\\d+)?)\\s*[-]?\\s*${areaUnit}\\s*(?:or\\s+more|and\\s+above|\\+|किंवा\\s*अधिक|या\\s*अधिक|या\\s*ज्यादा)`
        )
      )
    );
    const areaAbove = (
      q.match(
        new RegExp(
          `(?:above|more\\s+than|greater\\s+than|>)\\s*(\\d+(?:\\.\\d+)?)\\s*[-]?\\s*${areaUnit}`
        )
      ) ||
      q.match(
        new RegExp(
          `(\\d+(?:\\.\\d+)?)\\s*[-]?\\s*${areaUnit}\\s*(?:पेक्षा\\s*जास्त|से\\s*अधिक|से\\s*ज्यादा)`
        )
      )
    );
    const areaUnder = (
      q.match(
        new RegExp(
          `(?:under|less\\s+than|below|no\\s+more\\s+than|up\\s+to|at\\s+most|maximum(?:\\s+of)?|max\\b|<)\\s*(\\d+(?:\\.\\d+)?)\\s*[-]?\\s*${areaUnit}`
        )
      ) ||
      q.match(
        new RegExp(
          `(\\d+(?:\\.\\d+)?)\\s*[-]?\\s*${areaUnit}\\s*(?:पेक्षा\\s*कमी|पर्यंत|से\\s*कम|तक|or\\s+less|and\\s+below|किंवा\\s*कमी|या\\s*कम)`
        )
      )
    );
    const areaExplicitExact = q.match(
      new RegExp(`(?:exact(?:ly)?\\s+|नेमके\\s+|सटीक\\s+|अचूक\\s+|ठीक\\s+)(\\d+(?:\\.\\d+)?)\\s*[-]?\\s*${areaUnit}`)
    );
    const areaStandardExact = q.match(
      new RegExp(`(?:^|\\s|[^\\w\\u0900-\\u097F])(\\d+(?:\\.\\d+)?)\\s*[-]?\\s*${areaUnit}(?:\\s|$|[।,;.!?])`)
    );

    if (areaAtLeast) {
      minArea = parseFloat(areaAtLeast[1]);
      minAreaStrict = false;
    } else if (areaAbove && !q.includes('no more than') && !q.includes('जास्त दूर नसावी') && !q.includes('अधिक दूर नहीं')) {
      minArea = parseFloat(areaAbove[1]);
      minAreaStrict = true;
    } else if (areaUnder) {
      maxArea = parseFloat(areaUnder[1]);
    } else if (areaExplicitExact) {
      exactArea = parseFloat(areaExplicitExact[1]);
    } else if (areaStandardExact) {
      // Natural request: "10 acre agricultural land", "१० एकर शेतजमीन", "10 एकड़ कृषि भूमि"
      exactArea = parseFloat(areaStandardExact[1]);
    }
  }

  // 5. Price per Guntha
  let minPricePerGuntha: number | null = null;
  let maxPricePerGuntha: number | null = null;
  const gunthaUnit = '(?:gunthas?|guntha|guntas?|gunta|गुंठा|गुंठे)';
  const lacUnit = '(?:lakhs?|lakh|lacs?|lac|लाख)';
  const currUnit = '(?:₹|rs\\.?|inr|रुपये|रुपया)?';

  const gunthaRange = q.match(
    new RegExp(
      `(?:(?:price\\s+range|किंमत|कीमत)?\\s*(?:between)?\\s*${currUnit}\\s*(\\d+(?:\\.\\d+)?)\\s*${lacUnit}?\\s*(?:per|/|a|प्रति)?\\s*${gunthaUnit}?\\s*(?:to|and|-|ते|से)\\s*${currUnit}\\s*(\\d+(?:\\.\\d+)?)\\s*${lacUnit}\\s*${currUnit}\\s*(?:per|/|a|प्रति)?\\s*${gunthaUnit})`
    )
  );

  if (gunthaRange) {
    const g1 = parseFloat(gunthaRange[1]);
    const g2 = parseFloat(gunthaRange[2]);
    minPricePerGuntha = g1 < 1000 ? g1 * 100_000 : g1;
    maxPricePerGuntha = g2 < 1000 ? g2 * 100_000 : g2;
  } else if (q.includes('गुंठा') || q.includes('गुंठे') || q.includes('guntha') || q.includes('gunta')) {
    const fallbackRange = q.match(
      new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${lacUnit}?\\s*(?:-|to|and|ते|से)\\s*(\\d+(?:\\.\\d+)?)\\s*${lacUnit}`)
    );
    if (fallbackRange) {
      const g1 = parseFloat(fallbackRange[1]);
      const g2 = parseFloat(fallbackRange[2]);
      minPricePerGuntha = g1 < 1000 ? g1 * 100_000 : g1;
      maxPricePerGuntha = g2 < 1000 ? g2 * 100_000 : g2;
    } else {
      const singleGuntha = q.match(
        new RegExp(`${currUnit}\\s*(\\d+(?:\\.\\d+)?)\\s*(${lacUnit})?\\s*${currUnit}\\s*(?:per|/|a|प्रति)\\s*${gunthaUnit}`)
      );
      if (singleGuntha) {
        let amt = parseFloat(singleGuntha[1]);
        if (singleGuntha[2] || amt < 1000) amt = amt * 100_000;
        maxPricePerGuntha = amt;
      }
    }
  }

  // 6. Total Price
  let maxTotalPrice: number | null = null;
  if (!maxPricePerGuntha) {
    const lakhMatch = q.match(
      /(?:under|below|less than|up to|max|कमी|खाली)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|लाख)/
    );
    if (lakhMatch && !q.includes('guntha') && !q.includes('gunta') && !q.includes('गुंठा') && !q.includes('गुंठे')) {
      maxTotalPrice = parseFloat(lakhMatch[1]) * 100_000;
    }
    if (maxTotalPrice === null) {
      const directMatch = q.match(/(?:under|below|less than|up to)\s*(?:₹|rs\.?|inr)?\s*(\d{5,10})/);
      if (directMatch) {
        maxTotalPrice = parseFloat(directMatch[1]);
      }
    }
  }

  // 7. Road distance
  let maxRoadDistance: number | null = null;
  const roadMatch = q.match(
    /(?:no\s+more\s+than|within|under|less\s+than|up\s+to|near|at\s+most|कमी|आत)?\s*(\d+(?:\.\d+)?)\s*(?:m\b|meters?\b|metres?\b|मीटर)\s*(?:from|of|अंतरावर|पेक्षा\s*जास्त\s*दूर\s*नसावी|से\s*अधिक\s*दूर\s*नहीं|से\s*कम)?\s*(?:a\s*)?(?:road|highway|रस्ता|रस्त्या|सड़क)/
  );
  if (roadMatch) {
    maxRoadDistance = parseFloat(roadMatch[1]);
  } else {
    const prefixRoadMatch = q.match(
      /(?:रस्त्यापासून|रस्त्यालगत|रस्त्यावरून|रस्ता|सड़क\s*से|सड़क)\s*(?:कमीत\s*कमी|जास्तीत\s*जास्त|सुमारे|आत|पर्यंत|से)?\s*(\d+(?:\.\d+)?)\s*(?:m\b|meters?\b|metres?\b|मीटर)/
    );
    if (prefixRoadMatch) {
      maxRoadDistance = parseFloat(prefixRoadMatch[1]);
    }
  }

  // 8. Intent detection
  const mapIntent = /(?:map|location|नकाशा|स्थान|नक्शा|नक्शे|दाखवा|दिखाएं)/i.test(q);
  const verify712Intent = /(?:7\/12|7-12|७\/१२|उतारा|extract|पडताळा|सत्यापित|रेकॉर्ड|नोंद)/i.test(q);

  return {
    district,
    taluka,
    surveyNumber,
    exactArea,
    minArea,
    minAreaStrict,
    maxArea,
    minPricePerGuntha,
    maxPricePerGuntha,
    maxTotalPrice,
    maxRoadDistance,
    mapIntent,
    verify712Intent,
  };
}

/**
 * Executes deterministic filtering across properties based on parsed filters
 */
export function executeLocalSearch(query: string, allProperties: Property[] = properties): Property[] {
  const filters = parseSearchQuery(query);
  const q = normalizeQueryDigits(query);

  return allProperties.filter((p) => {
    if (filters.district && p.district !== filters.district) return false;
    if (filters.taluka && p.taluka.toLowerCase() !== filters.taluka.toLowerCase()) return false;
    if (filters.surveyNumber && !p.surveyNumber.toUpperCase().includes(filters.surveyNumber)) return false;

    // Exact Acreage with ±0.05 acre floating-point tolerance
    if (filters.exactArea !== null && Math.abs(p.areaAcres - filters.exactArea) > 0.05) return false;

    if (filters.minArea !== null) {
      if (filters.minAreaStrict && p.areaAcres <= filters.minArea) return false;
      if (!filters.minAreaStrict && p.areaAcres < filters.minArea) return false;
    }
    if (filters.maxArea !== null && p.areaAcres > filters.maxArea) return false;

    if (filters.minPricePerGuntha !== null && p.pricePerGuntha < filters.minPricePerGuntha) return false;
    if (filters.maxPricePerGuntha !== null && p.pricePerGuntha > filters.maxPricePerGuntha) return false;
    if (filters.maxTotalPrice !== null && p.totalPrice > filters.maxTotalPrice) return false;

    if (filters.maxRoadDistance !== null && p.roadDistanceMeters && p.roadDistanceMeters > filters.maxRoadDistance) {
      return false;
    }

    // Fallback keyword match if no structured filters were detected
    if (
      !filters.district &&
      !filters.taluka &&
      !filters.surveyNumber &&
      filters.exactArea === null &&
      filters.minArea === null &&
      filters.maxArea === null &&
      filters.maxTotalPrice === null &&
      filters.maxRoadDistance === null
    ) {
      return (
        p.district.toLowerCase().includes(q) ||
        p.taluka.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.surveyNumber.toLowerCase().includes(q) ||
        q.includes(p.district.toLowerCase()) ||
        q.includes(p.taluka.toLowerCase())
      );
    }

    return true;
  });
}
