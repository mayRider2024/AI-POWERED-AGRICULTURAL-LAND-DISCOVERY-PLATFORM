import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PropertyDetails from '../pages/PropertyDetails';
import IntelligenceReport from '../pages/IntelligenceReport';
import PropertyComparison from '../pages/PropertyComparison';
import { properties } from '../data/properties';

// Mock maplibre-gl to avoid canvas / webgl errors in jsdom
vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn(() => ({
      on: vi.fn(),
      remove: vi.fn(),
      addControl: vi.fn(),
      flyTo: vi.fn(),
    })),
    NavigationControl: vi.fn(),
  },
}));

// Mock SavedPropertiesContext
vi.mock('../context/SavedPropertiesContext', () => {
  const mockValue = {
    isSaved: () => false,
    toggleSave: vi.fn(),
    savedIds: [],
    loading: false,
    error: null,
    refreshSaved: vi.fn(),
    localBookmarksMigrated: false,
    guestPromptModalOpen: false,
    setGuestPromptModalOpen: vi.fn(),
    pendingGuestPropertyId: null,
  };
  return {
    useSaved: () => mockValue,
    useSavedProperties: () => mockValue,
  };
});

describe('Step 4.3 Bug Regression Tests', () => {
  describe('Bug 1 Regression: Property Details screen rendering without crash', () => {
    properties.forEach((prop) => {
      it(`renders property details for ${prop.id} (${prop.surveyNumber}) without white-screen or formatting crash`, () => {
        render(
          <MemoryRouter initialEntries={[`/property/${prop.id}`]}>
            <Routes>
              <Route path="/property/:id" element={<PropertyDetails />} />
            </Routes>
          </MemoryRouter>
        );

        // Verify the survey number is rendered
        expect(screen.getAllByText(new RegExp(prop.surveyNumber, 'i')).length).toBeGreaterThanOrEqual(1);
        // Verify taluka/district is rendered
        expect(screen.getAllByText(new RegExp(prop.taluka, 'i')).length).toBeGreaterThanOrEqual(1);
        // Verify demo coordinate string does not crash i18next (lat + longitude)
        expect(screen.getByText(new RegExp(`${prop.coordinates[1]}°N`, 'i'))).toBeInTheDocument();
      });
    });

    it('renders graceful "Property not found" state for invalid property ID', () => {
      render(
        <MemoryRouter initialEntries={['/property/invalid-unknown-999']}>
          <Routes>
            <Route path="/property/:id" element={<PropertyDetails />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Property not found/i)).toBeInTheDocument();
    });
  });

  describe('Bug 2 Regression: Intelligence Report respects property ID parameter', () => {
    properties.forEach((prop) => {
      it(`displays intelligence report for ${prop.id} (${prop.surveyNumber}) when navigated with ?id=${prop.id}`, () => {
        render(
          <MemoryRouter initialEntries={[`/intelligence?id=${prop.id}`]}>
            <Routes>
              <Route path="/intelligence" element={<IntelligenceReport />} />
            </Routes>
          </MemoryRouter>
        );

        // Verify that the survey number is rendered for the queried property
        expect(screen.getAllByText(new RegExp(prop.surveyNumber, 'i')).length).toBeGreaterThanOrEqual(1);
        // Verify taluka/district is rendered
        expect(screen.getAllByText(new RegExp(prop.taluka, 'i')).length).toBeGreaterThanOrEqual(1);
      });
    });

    it('renders explicit invalid property error when given bad id in query param', () => {
      render(
        <MemoryRouter initialEntries={['/intelligence?id=nonexistent-id']}>
          <Routes>
            <Route path="/intelligence" element={<IntelligenceReport />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Property Report Not Found/i)).toBeInTheDocument();
      expect(screen.getByText(/nonexistent-id/i)).toBeInTheDocument();
    });
  });

  describe('Property Comparison Data Consistency', () => {
    it('renders comparison table and toggles without crashing', () => {
      render(
        <MemoryRouter initialEntries={['/compare']}>
          <Routes>
            <Route path="/compare" element={<PropertyComparison />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify table headers and properties rendered
      expect(screen.getAllByText(/R-001/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/P-001/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});
