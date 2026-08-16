import { useState } from "react";
import {
  type CatalogFilters,
  type CatalogOptions,
  createDefaultFilters,
  SORT_OPTIONS,
} from "../catalog";

interface SearchFiltersProps {
  disabled: boolean;
  initialFilters: CatalogFilters;
  onReset: () => void;
  onSearch: (filters: CatalogFilters) => void;
  options: CatalogOptions;
}

const NUMBER_FILTERS = [
  ["minPrice", "Harga minimum", "Mulai dari...", 0],
  ["maxPrice", "Harga maksimum", "Hingga...", 0],
  ["guests", "Tamu minimum", "Jumlah tamu...", 1],
  ["bedrooms", "Kamar tidur", "Jumlah kamar...", 1],
  ["beds", "Tempat tidur", "Jumlah tempat tidur...", 1],
  ["bathrooms", "Kamar mandi", "Jumlah kamar...", 1],
] as const;

function copyFilters(filters: CatalogFilters): CatalogFilters {
  return { ...filters, amenities: [...filters.amenities] };
}

export default function SearchFilters({
  disabled,
  initialFilters,
  onReset,
  onSearch,
  options,
}: SearchFiltersProps) {
  const [draft, setDraft] = useState(() => copyFilters(initialFilters));

  function updateField(name: keyof CatalogFilters, value: string) {
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function toggleAmenity(id: string) {
    setDraft((current) => ({
      ...current,
      amenities: current.amenities.includes(id)
        ? current.amenities.filter((amenity) => amenity !== id)
        : [...current.amenities, id],
    }));
  }

  function reset() {
    setDraft(createDefaultFilters());
    onReset();
  }

  return (
    <form
      aria-busy={disabled}
      className="search-panel"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(copyFilters(draft));
      }}
    >
      <div className="search-panel__primary">
        <label className="field field--search">
          <span className="field__label">Cari</span>
          <input
            autoComplete="off"
            disabled={disabled}
            name="search"
            onChange={(event) => updateField("search", event.target.value)}
            placeholder="Contoh: vila di Bali..."
            type="search"
            value={draft.search}
          />
        </label>

        <label className="field">
          <span className="field__label">Lokasi</span>
          <select
            disabled={disabled}
            name="location"
            onChange={(event) => updateField("location", event.target.value)}
            value={draft.location}
          >
            <option value="">Semua lokasi</option>
            {options.locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.displayName}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Tipe</span>
          <select
            disabled={disabled}
            name="type"
            onChange={(event) => updateField("type", event.target.value)}
            value={draft.type}
          >
            <option value="">Semua tipe</option>
            {options.propertyTypes.map((propertyType) => (
              <option key={propertyType.id} value={propertyType.slug}>
                {propertyType.name}
              </option>
            ))}
          </select>
        </label>

        <button className="search-button" disabled={disabled} type="submit">
          {disabled ? "Mencari..." : "Cari properti"}
        </button>
      </div>

      <div className="search-panel__secondary">
        <label className="field">
          <span className="field__label">Urutkan</span>
          <select
            disabled={disabled}
            name="sort"
            onChange={(event) => updateField("sort", event.target.value)}
            value={draft.sort}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <details className="advanced-filters">
          <summary>
            <span className="advanced-filters__summary-copy">
              <strong>Filter lanjutan</strong>
              <span>Harga, kapasitas, dan amenitas</span>
            </span>
            <span aria-hidden="true" className="advanced-filters__indicator">
              +
            </span>
          </summary>
          <div className="advanced-filters__body">
            <div className="advanced-filters__grid">
              {NUMBER_FILTERS.map(([name, label, placeholder, min]) => (
                <label className="field" key={name}>
                  <span className="field__label">{label}</span>
                  <input
                    autoComplete="off"
                    disabled={disabled}
                    inputMode="numeric"
                    min={min}
                    name={name}
                    onChange={(event) => updateField(name, event.target.value)}
                    placeholder={placeholder}
                    type="number"
                    value={draft[name]}
                  />
                </label>
              ))}
            </div>

            <fieldset className="amenities">
              <legend>Amenitas wajib</legend>
              {options.amenities.map((amenity) => (
                <label className="amenity-option" key={amenity.id}>
                  <input
                    checked={draft.amenities.includes(amenity.id)}
                    disabled={disabled}
                    name="amenities"
                    onChange={() => toggleAmenity(amenity.id)}
                    type="checkbox"
                    value={amenity.id}
                  />
                  <span>{amenity.name}</span>
                </label>
              ))}
            </fieldset>
          </div>
        </details>

        <button
          className="reset-button"
          disabled={disabled}
          onClick={reset}
          type="button"
        >
          Reset filter
        </button>
      </div>
    </form>
  );
}
