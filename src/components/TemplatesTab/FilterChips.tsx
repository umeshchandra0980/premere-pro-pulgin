import React, { type KeyboardEvent } from 'react';

import type { TemplateCategory } from '../../types/caption';
import styles from './FilterChips.module.scss';

const FILTERS: TemplateCategory[] = [
  'All',
  'Minimal',
  'Bold',
  'Animated',
  'Branded',
];

export interface FilterChipsProps {
  active: TemplateCategory;
  onChange: (filter: TemplateCategory) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  const onKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    filter: TemplateCategory,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(filter);
    }
  };

  return (
    <div className={styles.filters} role="group" aria-label="Template filters">
      {FILTERS.map((filter) => {
        const isActive = active === filter;
        return (
          <button
            key={filter}
            type="button"
            className={`${styles.chip} ${isActive ? styles.active : ''}`}
            aria-pressed={isActive}
            onClick={() => onChange(filter)}
            onKeyDown={(e) => onKeyDown(e, filter)}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
