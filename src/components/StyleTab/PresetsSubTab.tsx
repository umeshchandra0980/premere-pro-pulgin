import React from 'react';

import { MOCK_STYLE_PRESETS } from '../../data/mockCaptions';
import type { StylePreset } from '../../types/caption';
import styles from './PresetsSubTab.module.scss';

export interface PresetsSubTabProps {
  onApply: (preset: StylePreset) => void;
}

export function PresetsSubTab({ onApply }: PresetsSubTabProps) {
  // TODO: replace with real API call — load presets from user library
  const presets = MOCK_STYLE_PRESETS;

  return (
    <div className={styles.grid}>
      {presets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          className={styles.card}
          onClick={() => onApply(preset)}
        >
          <div
            className={styles.preview}
            style={{ background: preset.previewColor }}
          >
            Aa
          </div>
          <span className={styles.name}>{preset.name}</span>
        </button>
      ))}
    </div>
  );
}
