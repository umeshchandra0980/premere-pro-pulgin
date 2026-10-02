import React, { type KeyboardEvent, type ReactNode } from 'react';

import { useCaptionContext } from '../../context/CaptionContext';
import type { MainTab } from '../../types/caption';
import styles from './TabBar.module.scss';

interface TabDef {
  id: MainTab;
  label: string;
  icon: ReactNode;
}

const TABS: TabDef[] = [
  {
    id: 'captions',
    label: 'AutoCaptions',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <rect x="1" y="3" width="12" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <rect x="3" y="6" width="5" height="1.5" rx="0.5" />
        <rect x="3" y="8.5" width="8" height="1.5" rx="0.5" />
      </svg>
    ),
  },
  {
    id: 'style',
    label: 'Style',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M8.5 2.5l3 3L5 12H2v-3L8.5 2.5z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="7.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="7.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
];

export function TabBar() {
  const { activeTab, setActiveTab } = useCaptionContext();

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, tab: MainTab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tab);
    }
  };

  return (
    <div className={styles.bar} role="tablist" aria-label="Caption panel tabs">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => onKeyDown(e, tab.id)}
          >
            <span className={styles.icon}>{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
