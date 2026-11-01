import { describe, it, expect } from 'vitest';
import { properties } from '../data/properties';
import {
  filterProperties,
  normalizeSearchQuery,
  extractSearchTokens,
} from '../utils/propertyFilter';

describe('Explore Search & Centralized Filter Regression Suite', () => {
  describe('1. Dataset baseline verification', () => {
    it('contains exactly 200 synthetic properties', () => {
      expect(properties.length).toBe(200);
    });

    it('has 101 Palghar properties and 99 Raigad properties', () => {
      const palghar = properties.filter((p) => p.district === 'Palghar');
      const raigad = properties.filter((p) => p.district === 'Raigad');
      expect(palghar.length).toBe(101);
      expect(raigad.length).toBe(99);
    });
  });

  describe('2. Village Search', () => {
    it('Search "Nandur" returns only Nandur properties (6)', () => {
      const results = filterProperties(properties, { query: 'Nandur' });
      expect(results.length).toBe(6);
      expect(results.every((p) => p.village === 'Nandur')).toBe(true);
    });

    it('Search "Kasa" returns only Kasa properties (4) without matching Kashele', () => {
      const results = filterProperties(properties, { query: 'Kasa' });
      expect(results.length).toBe(4);
      expect(results.every((p) => p.village === 'Kasa')).toBe(true);
    });

    it('Search "Vangaon" returns only Vangaon properties (6) without matching Vangani', () => {
      const results = filterProperties(properties, { query: 'Vangaon' });
      expect(results.length).toBe(6);
      expect(results.every((p) => p.village === 'Vangaon')).toBe(true);
    });

    it('Search "Borigaon" returns only Borigaon properties (2)', () => {
      const results = filterProperties(properties, { query: 'Borigaon' });
      expect(results.length).toBe(2);
      expect(results.every((p) => p.village === 'Borigaon')).toBe(true);
    });
  });

  describe('3. Taluka Search', () => {
    it('Search "Dahanu" returns all Dahanu properties (22)', () => {
      const results = filterProperties(properties, { query: 'Dahanu' });
      expect(results.length).toBe(22);
      expect(results.every((p) => p.taluka === 'Dahanu')).toBe(true);
    });

    it('Search "Vikramgad" returns all Vikramgad properties (23)', () => {
      const results = filterProperties(properties, { query: 'Vikramgad' });
      expect(results.length).toBe(23);
      expect(results.every((p) => p.taluka === 'Vikramgad')).toBe(true);
    });

    it('Search "Alibag" returns all Alibag properties (19)', () => {
      const results = filterProperties(properties, { query: 'Alibag' });
      expect(results.length).toBe(19);
      expect(results.every((p) => p.taluka === 'Alibag')).toBe(true);
    });

    it('Search "Panvel" returns all Panvel properties (15)', () => {
      const results = filterProperties(properties, { query: 'Panvel' });
      expect(results.length).toBe(15);
      expect(results.every((p) => p.taluka === 'Panvel')).toBe(true);
    });

    it('Search "Talasari" returns all Talasari properties (14)', () => {
      const results = filterProperties(properties, { query: 'Talasari' });
      expect(results.length).toBe(14);
      expect(results.every((p) => p.taluka === 'Talasari')).toBe(true);
    });
  });

  describe('4. District Search', () => {
    it('Search "Palghar" returns all Palghar district properties (101)', () => {
      const results = filterProperties(properties, { query: 'Palghar' });
      expect(results.length).toBe(101);
      expect(results.every((p) => p.district === 'Palghar')).toBe(true);
    });

    it('Search "Raigad" returns all Raigad district properties (99)', () => {
      const results = filterProperties(properties, { query: 'Raigad' });
      expect(results.length).toBe(99);
      expect(results.every((p) => p.district === 'Raigad')).toBe(true);
    });
  });

  describe('5. Survey / Gat Number Search', () => {
    it('Search "P-PAL-100" returns exactly one matching property', () => {
      const results = filterProperties(properties, { query: 'P-PAL-100' });
      expect(results.length).toBe(1);
      expect(results[0].surveyNumber).toBe('P-PAL-100');
      expect(results[0].id).toBe('p-exact-01');
    });

    it('Search "P-DAH-103" returns exactly one matching property', () => {
      const results = filterProperties(properties, { query: 'P-DAH-103' });
      expect(results.length).toBe(1);
      expect(results[0].surveyNumber).toBe('P-DAH-103');
      expect(results[0].id).toBe('prop-103');
    });

    it('Search "P-TAL-107" returns exactly one matching property', () => {
      const results = filterProperties(properties, { query: 'P-TAL-107' });
      expect(results.length).toBe(1);
      expect(results[0].surveyNumber).toBe('P-TAL-107');
      expect(results[0].id).toBe('prop-107');
    });

    it('Search "125/2" returns exactly one matching property', () => {
      const results = filterProperties(properties, { query: '125/2' });
      expect(results.length).toBe(1);
      expect(results[0].surveyNumber).toBe('125/2');
      expect(results[0].id).toBe('p-panvel-01');
    });

    it('Search "125 / 2" with spaces normalizes and returns 125/2', () => {
      const results = filterProperties(properties, { query: '125 / 2' });
      expect(results.length).toBe(1);
      expect(results[0].surveyNumber).toBe('125/2');
    });

    it('Search "p-pal-100" (lowercase) matches P-PAL-100', () => {
      const results = filterProperties(properties, { query: 'p-pal-100' });
      expect(results.length).toBe(1);
      expect(results[0].surveyNumber).toBe('P-PAL-100');
    });

    it('Search "P - PAL - 100" with spaces normalizes to P-PAL-100', () => {
      const results = filterProperties(properties, { query: 'P - PAL - 100' });
      expect(results.length).toBe(1);
      expect(results[0].surveyNumber).toBe('P-PAL-100');
    });
  });

  describe('6. Combined Location Searches', () => {
    it('Search "Nandur Vikramgad" returns 6 properties in Nandur, Vikramgad', () => {
      const results = filterProperties(properties, { query: 'Nandur Vikramgad' });
      expect(results.length).toBe(6);
      expect(results.every((p) => p.village === 'Nandur' && p.taluka === 'Vikramgad')).toBe(true);
    });

    it('Search "Vangaon Dahanu" returns 6 properties in Vangaon, Dahanu', () => {
      const results = filterProperties(properties, { query: 'Vangaon Dahanu' });
      expect(results.length).toBe(6);
      expect(results.every((p) => p.village === 'Vangaon' && p.taluka === 'Dahanu')).toBe(true);
    });

    it('Search "Kasa Dahanu" returns 4 properties in Kasa, Dahanu', () => {
      const results = filterProperties(properties, { query: 'Kasa Dahanu' });
      expect(results.length).toBe(4);
      expect(results.every((p) => p.village === 'Kasa' && p.taluka === 'Dahanu')).toBe(true);
    });

    it('Search "Alibag Raigad" returns 19 properties in Alibag, Raigad', () => {
      const results = filterProperties(properties, { query: 'Alibag Raigad' });
      expect(results.length).toBe(19);
      expect(results.every((p) => p.taluka === 'Alibag' && p.district === 'Raigad')).toBe(true);
    });
  });

  describe('7. Normalization & Case Insensitivity', () => {
    it('returns the same 6 properties for "Nandur", "nandur", "NANDUR", and "  Nandur  "', () => {
      const r1 = filterProperties(properties, { query: 'Nandur' });
      const r2 = filterProperties(properties, { query: 'nandur' });
      const r3 = filterProperties(properties, { query: 'NANDUR' });
      const r4 = filterProperties(properties, { query: '  Nandur  ' });

      expect(r1.length).toBe(6);
      expect(r2.length).toBe(6);
      expect(r3.length).toBe(6);
      expect(r4.length).toBe(6);
      expect(r1.map((p) => p.id)).toEqual(r2.map((p) => p.id));
      expect(r1.map((p) => p.id)).toEqual(r3.map((p) => p.id));
      expect(r1.map((p) => p.id)).toEqual(r4.map((p) => p.id));
    });
  });

  describe('8. Marathi and Devanagari Location Transliteration', () => {
    it('Search "नांदूर" returns 6 Nandur properties', () => {
      const results = filterProperties(properties, { query: 'नांदूर' });
      expect(results.length).toBe(6);
      expect(results.every((p) => p.village === 'Nandur')).toBe(true);
    });

    it('Search "कासा" returns 4 Kasa properties', () => {
      const results = filterProperties(properties, { query: 'कासा' });
      expect(results.length).toBe(4);
      expect(results.every((p) => p.village === 'Kasa')).toBe(true);
    });

    it('Search "डहाणू" returns 22 Dahanu properties', () => {
      const results = filterProperties(properties, { query: 'डहाणू' });
      expect(results.length).toBe(22);
      expect(results.every((p) => p.taluka === 'Dahanu')).toBe(true);
    });

    it('Search "विक्रमगड" returns 23 Vikramgad properties', () => {
      const results = filterProperties(properties, { query: 'विक्रमगड' });
      expect(results.length).toBe(23);
      expect(results.every((p) => p.taluka === 'Vikramgad')).toBe(true);
    });

    it('Search "पालघर" returns 101 Palghar properties', () => {
      const results = filterProperties(properties, { query: 'पालघर' });
      expect(results.length).toBe(101);
      expect(results.every((p) => p.district === 'Palghar')).toBe(true);
    });

    it('Search "रायगड" returns 99 Raigad properties', () => {
      const results = filterProperties(properties, { query: 'रायगड' });
      expect(results.length).toBe(99);
      expect(results.every((p) => p.district === 'Raigad')).toBe(true);
    });

    it('Search "१२५/२" (Devanagari digits) returns 125/2 survey number', () => {
      const results = filterProperties(properties, { query: '१२५/२' });
      expect(results.length).toBe(1);
      expect(results[0].surveyNumber).toBe('125/2');
    });
  });

  describe('9. Natural language filler / stop words', () => {
    it('Search "Nandur village" matches Nandur (6)', () => {
      const results = filterProperties(properties, { query: 'Nandur village' });
      expect(results.length).toBe(6);
    });

    it('Search "Vikramgad taluka" matches Vikramgad (23)', () => {
      const results = filterProperties(properties, { query: 'Vikramgad taluka' });
      expect(results.length).toBe(23);
    });

    it('Search "Palghar district" matches Palghar (101)', () => {
      const results = filterProperties(properties, { query: 'Palghar district' });
      expect(results.length).toBe(101);
    });
  });

  describe('10. Combination with Explore Structured Filters', () => {
    it('Search "Nandur" + district "Palghar" returns 6 properties', () => {
      const results = filterProperties(properties, {
        query: 'Nandur',
        district: 'Palghar',
      });
      expect(results.length).toBe(6);
    });

    it('Search "Nandur" + minArea 10 returns only properties with >= 10 acres', () => {
      const results = filterProperties(properties, {
        query: 'Nandur',
        minArea: 10,
      });
      expect(results.length).toBe(2);
      expect(results.every((p) => p.village === 'Nandur' && p.areaAcres >= 10)).toBe(true);
    });

    it('Search "Nandur" + conflicting district "Raigad" returns 0 properties', () => {
      const results = filterProperties(properties, {
        query: 'Nandur',
        district: 'Raigad',
      });
      expect(results.length).toBe(0);
    });
  });

  describe('11. Exclusion & Zero-Match Handling', () => {
    it('Search "Nandur" excludes P-DAH-147 (12-acre property)', () => {
      const results = filterProperties(properties, { query: 'Nandur' });
      const pdah147 = results.find((p) => p.surveyNumber === 'P-DAH-147');
      expect(pdah147).toBeUndefined();
    });

    it('Search "XYZNonExistentVillage" returns 0 properties', () => {
      const results = filterProperties(properties, { query: 'XYZNonExistentVillage' });
      expect(results.length).toBe(0);
    });

    it('Empty query returns all 200 properties', () => {
      const results = filterProperties(properties, { query: '' });
      expect(results.length).toBe(200);
    });

    it('Clearing search query restores all 200 properties', () => {
      const searched = filterProperties(properties, { query: 'Nandur' });
      expect(searched.length).toBe(6);
      const cleared = filterProperties(properties, { query: '' });
      expect(cleared.length).toBe(200);
    });
  });
});
