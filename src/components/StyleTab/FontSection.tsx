import React from 'react';

import { CAPTION_FONTS, resolveFontStack } from '../../data/mockCaptions';
import type { StyleSettings } from '../../types/caption';
import { ColorSwatch } from './ColorSwatch';
import styles from './FontSection.module.scss';

export interface FontSectionProps {
  settings: StyleSettings;
  onChange: (patch: Partial<StyleSettings>) => void;
}

export function FontSection({ settings, onChange }: FontSectionProps) {
  return (
    <div>
      <p className={styles.sectionTitle}>Typography</p>
      <div className={styles.card}>
        <label className={styles.field}>
          <span className={styles.label}>Font</span>
          <select
            className={styles.select}
            value={settings.fontFamily}
            aria-label="Caption font"
            style={{ fontFamily: resolveFontStack(settings.fontFamily) }}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
          >
            {CAPTION_FONTS.map((font) => (
              <option
                key={font.id}
                value={font.id}
                style={{ fontFamily: font.stack }}
              >
                {font.label}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.row}>
          <label className={styles.fieldGrow}>
            <span className={styles.label}>
              Size <span className={styles.value}>{settings.fontSize}px</span>
            </span>
            <input
              type="range"
              className={styles.range}
              min={18}
              max={72}
              step={1}
              value={settings.fontSize}
              aria-label="Font size"
              onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
              onInput={(e) =>
                onChange({
                  fontSize: Number((e.target as HTMLInputElement).value),
                })
              }
            />
          </label>

          <label className={styles.weightField}>
            <span className={styles.label}>Weight</span>
            <select
              className={styles.select}
              value={settings.fontWeight}
              aria-label="Font weight"
              onChange={(e) => onChange({ fontWeight: Number(e.target.value) })}
            >
              <option value={400}>Regular</option>
              <option value={500}>Medium</option>
              <option value={600}>SemiBold</option>
              <option value={700}>Bold</option>
              <option value={800}>ExtraBold</option>
            </select>
          </label>
        </div>

        <div className={styles.fillRow}>
          <span className={styles.label}>Fill</span>
          <ColorSwatch
            value={settings.fillColor}
            onChange={(color) => onChange({ fillColor: color })}
            ariaLabel="Fill color"
          />
        </div>

        <div
          className={styles.sample}
          style={{
            fontFamily: resolveFontStack(settings.fontFamily),
            fontSize: Math.min(28, settings.fontSize * 0.55),
            fontWeight: settings.fontWeight,
            color: settings.fillColor,
            WebkitTextStroke:
              settings.strokeWidth > 0
                ? `${Math.max(0.5, settings.strokeWidth * 0.35)}px ${settings.strokeColor}`
                : undefined,
            textShadow: settings.glowEnabled
              ? `0 0 ${settings.glowBlur * 0.35}px ${settings.glowColor}`
              : undefined,
          }}
        >
          Aa — {settings.fontFamily}
        </div>
      </div>
    </div>
  );
}
