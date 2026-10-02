import React, { type KeyboardEvent } from 'react';

import type { StyleSubTab } from '../../types/caption';
import styles from './StyleSubTabBar.module.scss';

const SUB_TABS: { id: StyleSubTab; label: string }[] = [
  { id: 'animate', label: 'Animate' },
  { id: 'style', label: 'Style' },
  { id: 'presets', label: 'Presets' },
];

export interface StyleSubTabBarProps {
  active: StyleSubTab;
  onChange: (tab: StyleSubTab) => void;
}

export function StyleSubTabBar({ active, onChange }: StyleSubTabBarProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, tab: StyleSubTab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(tab);
    }
  };

  return (
    <div className={styles.bar} role="tablist" aria-label="Style sub-tabs">
      {SUB_TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.pill} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
