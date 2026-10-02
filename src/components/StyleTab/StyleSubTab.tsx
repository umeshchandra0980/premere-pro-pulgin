import React from 'react';

import type { StyleSettings } from '../../types/caption';
import { ColorSwatch } from './ColorSwatch';
import { EffectsSection } from './EffectsSection';
import { FontSection } from './FontSection';
import styles from './StyleSubTab.module.scss';

export interface StyleSubTabProps {
  settings: StyleSettings;
  onChange: (patch: Partial<StyleSettings>) => void;
}

export function StyleSubTab({ settings, onChange }: StyleSubTabProps) {
  return (
    <div className={styles.root}>
      {/* Main Style only — Pause/Checkerboard live above the preview in StyleTab */}
      <FontSection settings={settings} onChange={onChange} />

      <div>
        <p className={styles.sectionTitle}>Stroke · main style</p>
        <div className={styles.strokeCard}>
          <div className={styles.strokeRow}>
            <div className={styles.widthField}>
              <span className={styles.widthLabel}>Width</span>
              <input
                type="number"
                className={styles.widthInput}
                min={0}
                max={20}
                step={1}
                value={settings.strokeWidth}
                aria-label="Stroke width"
                onChange={(e) =>
                  onChange({ strokeWidth: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className={styles.swatchGrow}>
              <ColorSwatch
                value={settings.strokeColor}
                onChange={(color) => onChange({ strokeColor: color })}
                ariaLabel="Stroke color"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Effects toggles = main style; Glow expands INLINE nested controls */}
      <EffectsSection settings={settings} onChange={onChange} />
    </div>
  );
}
