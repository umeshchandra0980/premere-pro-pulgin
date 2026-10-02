import React from 'react';

import type { StyleSettings } from '../../types/caption';
import { ToggleRow } from '../Shared/ToggleRow';
import { ColorSwatch } from './ColorSwatch';
import styles from './EffectsSection.module.scss';

export interface EffectsSectionProps {
  settings: StyleSettings;
  onChange: (patch: Partial<StyleSettings>) => void;
}

export function EffectsSection({ settings, onChange }: EffectsSectionProps) {
  const {
    effectsExpanded,
    gradientEnabled,
    glowEnabled,
    glowColor,
    glowBlur,
    glowIntensity,
  } = settings;

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={effectsExpanded}
        onClick={() => onChange({ effectsExpanded: !effectsExpanded })}
      >
        Effects · main style
        <span
          className={`${styles.chevron} ${effectsExpanded ? styles.chevronOpen : ''}`}
          aria-hidden
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5L6 8l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {effectsExpanded ? (
        <div className={styles.body}>
          <ToggleRow
            title="Gradient"
            checked={gradientEnabled}
            onChange={(checked) => onChange({ gradientEnabled: checked })}
          />
          <ToggleRow
            title="Glow"
            checked={glowEnabled}
            onChange={(checked) => onChange({ glowEnabled: checked })}
          />

          {glowEnabled ? (
            <div className={styles.glowControls}>
              <p className={styles.inlineTag}>Inline · Glow</p>
              <div className={styles.controlRow}>
                <span className={styles.controlLabel}>Color</span>
                <ColorSwatch
                  value={glowColor}
                  onChange={(color) => onChange({ glowColor: color })}
                  ariaLabel="Glow color"
                />
              </div>

              <div className={styles.controlRow}>
                <div className={styles.controlLabel}>
                  <span>Blur</span>
                  <span className={styles.value}>{glowBlur}</span>
                </div>
                <input
                  type="range"
                  className={styles.range}
                  min={0}
                  max={100}
                  step={1}
                  value={glowBlur}
                  aria-label="Glow blur"
                  onChange={(e) => onChange({ glowBlur: Number(e.target.value) })}
                  onInput={(e) =>
                    onChange({
                      glowBlur: Number((e.target as HTMLInputElement).value),
                    })
                  }
                />
              </div>

              <div className={styles.controlRow}>
                <div className={styles.controlLabel}>
                  <span>Intensity</span>
                  <span className={styles.value}>{glowIntensity}</span>
                </div>
                <input
                  type="range"
                  className={styles.range}
                  min={0}
                  max={100}
                  step={1}
                  value={glowIntensity}
                  aria-label="Glow intensity"
                  onChange={(e) =>
                    onChange({ glowIntensity: Number(e.target.value) })
                  }
                  onInput={(e) =>
                    onChange({
                      glowIntensity: Number(
                        (e.target as HTMLInputElement).value,
                      ),
                    })
                  }
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
