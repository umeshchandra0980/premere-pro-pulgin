import React from 'react';

import type { TemplateItem } from '../../types/caption';
import styles from './TemplateCard.module.scss';

export interface TemplateCardProps {
  template: TemplateItem;
  isApplied: boolean;
  onApply: (id: string) => void;
}

export function TemplateCard({
  template,
  isApplied,
  onApply,
}: TemplateCardProps) {
  return (
    <div className={`${styles.card} ${isApplied ? styles.applied : ''}`}>
      <div
        className={styles.preview}
        style={{ background: template.previewColor }}
      >
        <div className={styles.overlay}>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={() => onApply(template.id)}
          >
            Apply
          </button>
        </div>
      </div>
      <div className={styles.meta}>
        <span className={styles.name}>{template.name}</span>
        {isApplied ? (
          <span className={styles.badge}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path
                d="M2 5.2l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Applied
          </span>
        ) : null}
      </div>
    </div>
  );
}
