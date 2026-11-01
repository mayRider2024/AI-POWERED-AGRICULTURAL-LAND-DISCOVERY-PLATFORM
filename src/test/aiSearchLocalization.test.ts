import { describe, it, expect } from 'vitest';
import { executeLocalSearch, parseSearchQuery, normalizeQueryDigits } from '../utils/aiSearchParser';
import enJson from '../i18n/locales/en.json';
import mrJson from '../i18n/locales/mr.json';
import hiJson from '../i18n/locales/hi.json';

describe('LandLens AI — Comprehensive AI Search Localization & Parser Tests', () => {
  const EXPECTED_6_SURVEYS = [
    'P-PAL-100',
    'P-PAL-101',
    'P-VIK-101',
    'P-DAH-103',
    'P-TAL-107',
    'P-DAH-109',
  ];

  describe('1. Complex Tri-Lingual Search Equivalence', () => {
    const englishQuery =
      '10-acre agricultural land in Palghar with price between ₹10 lakh and ₹15 lakh per guntha within 100 metres of a road';
    const marathiQuery =
      'पालघरमध्ये १० एकर जमीन, किंमत प्रति गुंठा १० ते १५ लाख आणि रस्त्यापासून १०० मीटर अंतरावर';
    const hindiQuery =
      'पालघर में 10 एकड़ ज़मीन, कीमत 10 लाख से 15 लाख रुपये प्रति गुंठा और सड़क से 100 मीटर से अधिक दूर नहीं';

    it('English complex query returns exactly 6 properties and excludes P-DAH-147', () => {
      const results = executeLocalSearch(englishQuery);
      const surveys = results.map((r) => r.surveyNumber);
      expect(results.length).toBe(6);
      EXPECTED_6_SURVEYS.forEach((expected) => {
        expect(surveys).toContain(expected);
      });
      expect(surveys).not.toContain('P-DAH-147');
    });

    it('Marathi complex query returns identical 6 properties and excludes P-DAH-147', () => {
      const results = executeLocalSearch(marathiQuery);
      const surveys = results.map((r) => r.surveyNumber);
      expect(results.length).toBe(6);
      EXPECTED_6_SURVEYS.forEach((expected) => {
        expect(surveys).toContain(expected);
      });
      expect(surveys).not.toContain('P-DAH-147');
    });

    it('Hindi complex query returns identical 6 properties and excludes P-DAH-147', () => {
      const results = executeLocalSearch(hindiQuery);
      const surveys = results.map((r) => r.surveyNumber);
      expect(results.length).toBe(6);
      EXPECTED_6_SURVEYS.forEach((expected) => {
        expect(surveys).toContain(expected);
      });
      expect(surveys).not.toContain('P-DAH-147');
    });

    it('All three languages produce identical parsed filter values', () => {
      const parsedEn = parseSearchQuery(englishQuery);
      const parsedMr = parseSearchQuery(marathiQuery);
      const parsedHi = parseSearchQuery(hindiQuery);

      expect(parsedEn.district).toBe('Palghar');
      expect(parsedMr.district).toBe('Palghar');
      expect(parsedHi.district).toBe('Palghar');

      expect(parsedEn.exactArea).toBe(10);
      expect(parsedMr.exactArea).toBe(10);
      expect(parsedHi.exactArea).toBe(10);

      expect(parsedEn.minPricePerGuntha).toBe(1_000_000);
      expect(parsedMr.minPricePerGuntha).toBe(1_000_000);
      expect(parsedHi.minPricePerGuntha).toBe(1_000_000);

      expect(parsedEn.maxPricePerGuntha).toBe(1_500_000);
      expect(parsedMr.maxPricePerGuntha).toBe(1_500_000);
      expect(parsedHi.maxPricePerGuntha).toBe(1_500_000);

      expect(parsedEn.maxRoadDistance).toBe(100);
      expect(parsedMr.maxRoadDistance).toBe(100);
      expect(parsedHi.maxRoadDistance).toBe(100);
    });
  });

  describe('2. Acreage Nuances (Exact vs Min vs Max vs Range)', () => {
    it('Exact 10 acres: parses exactArea=10 without min or max bounding', () => {
      const qEn = parseSearchQuery('10 acres agricultural land in Palghar');
      expect(qEn.exactArea).toBe(10);
      expect(qEn.minArea).toBeNull();
      expect(qEn.maxArea).toBeNull();

      const qMr = parseSearchQuery('पालघरमध्ये १० एकर शेती जमीन');
      expect(qMr.exactArea).toBe(10);
      expect(qMr.minArea).toBeNull();
      expect(qMr.maxArea).toBeNull();

      const qHi = parseSearchQuery('पालघर में 10 एकड़ कृषि भूमि');
      expect(qHi.exactArea).toBe(10);
      expect(qHi.minArea).toBeNull();
      expect(qHi.maxArea).toBeNull();
    });

    it('At least 10 acres: parses minArea=10, minAreaStrict=false, exactArea=null', () => {
      const qEn = parseSearchQuery('at least 10 acres in Palghar');
      expect(qEn.minArea).toBe(10);
      expect(qEn.minAreaStrict).toBe(false);
      expect(qEn.exactArea).toBeNull();

      const qMr = parseSearchQuery('पालघरमध्ये कमीतकमी १० एकर जमीन');
      expect(qMr.minArea).toBe(10);
      expect(qMr.minAreaStrict).toBe(false);
      expect(qMr.exactArea).toBeNull();

      const qHi = parseSearchQuery('पालघर में कम से कम 10 एकड़ ज़मीन');
      expect(qHi.minArea).toBe(10);
      expect(qHi.minAreaStrict).toBe(false);
      expect(qHi.exactArea).toBeNull();

      // At least 10 acres includes P-DAH-147 (12 acres)
      const res = executeLocalSearch('at least 10 acres in Palghar');
      const surveys = res.map((r) => r.surveyNumber);
      expect(surveys).toContain('P-DAH-147');
    });

    it('More than 10 acres: parses minArea=10, minAreaStrict=true', () => {
      const qEn = parseSearchQuery('more than 10 acres in Palghar');
      expect(qEn.minArea).toBe(10);
      expect(qEn.minAreaStrict).toBe(true);

      const qMr = parseSearchQuery('१० एकर पेक्षा जास्त जमीन');
      expect(qMr.minArea).toBe(10);
      expect(qMr.minAreaStrict).toBe(true);

      const qHi = parseSearchQuery('10 एकड़ से अधिक ज़मीन');
      expect(qHi.minArea).toBe(10);
      expect(qHi.minAreaStrict).toBe(true);
    });

    it('Under 10 acres: parses maxArea=10', () => {
      const qEn = parseSearchQuery('under 10 acres in Raigad');
      expect(qEn.maxArea).toBe(10);
      expect(qEn.exactArea).toBeNull();

      const qMr = parseSearchQuery('१० एकर पेक्षा कमी जमीन');
      expect(qMr.maxArea).toBe(10);
      expect(qMr.exactArea).toBeNull();

      const qHi = parseSearchQuery('10 एकड़ से कम ज़मीन');
      expect(qHi.maxArea).toBe(10);
      expect(qHi.exactArea).toBeNull();
    });

    it('Between 8 and 12 acres: parses minArea=8, maxArea=12', () => {
      const qEn = parseSearchQuery('between 8 and 12 acres in Palghar');
      expect(qEn.minArea).toBe(8);
      expect(qEn.maxArea).toBe(12);
      expect(qEn.exactArea).toBeNull();

      const qMr = parseSearchQuery('८ ते १२ एकर जमीन');
      expect(qMr.minArea).toBe(8);
      expect(qMr.maxArea).toBe(12);
      expect(qMr.exactArea).toBeNull();

      const qHi = parseSearchQuery('8 से 12 एकड़ ज़मीन');
      expect(qHi.minArea).toBe(8);
      expect(qHi.maxArea).toBe(12);
      expect(qHi.exactArea).toBeNull();
    });
  });

  describe('3. Devanagari Digits & Regional Language Terms', () => {
    it('Normalizes all Devanagari numerals ०-९ to 0-9', () => {
      expect(normalizeQueryDigits('०१२३४५६७८९')).toBe('0123456789');
    });

    it('Parses Marathi and Hindi Talukas and Districts', () => {
      expect(parseSearchQuery('पनवेल शेती जमीन').taluka).toBe('Panvel');
      expect(parseSearchQuery('पनवेल शेती जमीन').district).toBe('Raigad');

      expect(parseSearchQuery('विक्रमगड जमीन').taluka).toBe('Vikramgad');
      expect(parseSearchQuery('विक्रमगड जमीन').district).toBe('Palghar');

      expect(parseSearchQuery('डहाणू शेती जमीन').taluka).toBe('Dahanu');
      expect(parseSearchQuery('डहाणू शेती जमीन').district).toBe('Palghar');

      expect(parseSearchQuery('दहानू कृषि भूमि').taluka).toBe('Dahanu');
      expect(parseSearchQuery('रायगढ़ में ज़मीन').district).toBe('Raigad');
      expect(parseSearchQuery('रायगड मधील जमीन').district).toBe('Raigad');
    });

    it('Parses Survey & Gat numbers in Marathi and Hindi', () => {
      expect(parseSearchQuery('सर्व्हे क्र. 125/2').surveyNumber).toBe('125/2');
      expect(parseSearchQuery('गट क्र. 45').surveyNumber).toBe('45');
      expect(parseSearchQuery('खसरा नं. 125/2').surveyNumber).toBe('125/2');
      expect(parseSearchQuery('सर्वे नंबर P-PAL-100').surveyNumber).toBe('P-PAL-100');
    });

    it('Parses Road Proximity in Marathi and Hindi', () => {
      expect(parseSearchQuery('रस्त्यापासून ५० मीटर').maxRoadDistance).toBe(50);
      expect(parseSearchQuery('रस्त्यालगत १०० मीटर').maxRoadDistance).toBe(100);
      expect(parseSearchQuery('सड़क से 100 मीटर से अधिक दूर नहीं').maxRoadDistance).toBe(100);
    });

    it('Detects Map and 7/12 Intent', () => {
      expect(parseSearchQuery('नकाशावर पाहा').mapIntent).toBe(true);
      expect(parseSearchQuery('नक्शे पर दिखाएं').mapIntent).toBe(true);
      expect(parseSearchQuery('show on map').mapIntent).toBe(true);

      expect(parseSearchQuery('७/१२ उतारा दाखवा').verify712Intent).toBe(true);
      expect(parseSearchQuery('7/12 सत्यापन प्रक्रिया').verify712Intent).toBe(true);
      expect(parseSearchQuery('explain 7/12 land records').verify712Intent).toBe(true);
    });
  });

  describe('4. Localization Integrity (EN, MR, HI Dictionaries)', () => {
    const requiredKeys = [
      'title',
      'modeAuto',
      'modeServer',
      'modeLocal',
      'serverStatusOnline',
      'serverStatusOffline',
      'serverConfig',
      'matchingPropertiesFound',
      'noPropertiesFound',
      'geminiInterpreted',
      'localMatched',
      'localNoMatch',
      'syntheticDemoProperty',
      'illustrativeCoordinates',
      'pricePerGuntha',
      'fromRoad',
      'viewOnMap',
      'verify712',
      'viewDetails',
      'save',
      'saved',
      'guidanceTitle',
      'guidanceSubtitle',
      'disclaimerBanner',
      'disclaimerBody',
      'officialPortalPrompt',
      'openMahabhulekh',
      'close',
      'demoReferenceParams',
      'districtLabel',
      'talukaLabel',
      'villageLabel',
      'demoGatSurveyLabel',
      'suggestedQuery1',
      'suggestedQuery2',
      'suggestedQuery3',
      'suggestedQuery4',
      'suggestedQuery5',
      'suggestedQuery6',
    ];

    it('All required keys exist in English locale', () => {
      requiredKeys.forEach((k) => {
        expect((enJson.aiAssistant as any)[k], `Missing EN key: ${k}`).toBeDefined();
        expect(typeof (enJson.aiAssistant as any)[k]).toBe('string');
      });
    });

    it('All required keys exist in Marathi locale', () => {
      requiredKeys.forEach((k) => {
        expect((mrJson.aiAssistant as any)[k], `Missing MR key: ${k}`).toBeDefined();
        expect(typeof (mrJson.aiAssistant as any)[k]).toBe('string');
      });
    });

    it('All required keys exist in Hindi locale', () => {
      requiredKeys.forEach((k) => {
        expect((hiJson.aiAssistant as any)[k], `Missing HI key: ${k}`).toBeDefined();
        expect(typeof (hiJson.aiAssistant as any)[k]).toBe('string');
      });
    });

    it('Disclaimers honestly state synthetic demo status in all 3 languages', () => {
      expect(enJson.aiAssistant.disclaimerBanner).toContain('NOT A GOVERNMENT 7/12 EXTRACT');
      expect(mrJson.aiAssistant.disclaimerBanner).toContain('अधिकृत सरकारी ७/१२ उतारा नाही');
      expect(hiJson.aiAssistant.disclaimerBanner).toContain('आधिकारिक सरकारी ७/१२ उद्धरण नहीं');

      expect(enJson.aiAssistant.syntheticDemoProperty).toBe('Synthetic Demo Property');
      expect(mrJson.aiAssistant.syntheticDemoProperty).toBe('काल्पनिक प्रात्यक्षिक जमीन');
      expect(hiJson.aiAssistant.syntheticDemoProperty).toBe('काल्पनिक डेमो ज़मीन');
    });
  });
});
