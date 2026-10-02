import React from 'react';

import { ANIMATION_PRESETS } from '../../data/mockCaptions';
import type {
  AnimateBy,
  EasePreset,
  ExitMode,
  StyleSettings,
} from '../../types/caption';
import styles from './AnimateSubTab.module.scss';

const EASE_PATHS: Record<EasePreset, string> = {
  Elastic: 'M0,40 C40,40 55,6 95,16 C130,26 155,4 200,4',
  'Ease Out': 'M0,40 C80,40 120,6 200,4',
  'Ease In Out': 'M0,40 C50,40 50,4 200,4',
  Bounce: 'M0,40 C30,40 40,8 70,14 C100,6 130,10 160,4 200,4',
  Linear: 'M0,40 L200,4',
};

export interface AnimateSubTabProps {
  settings: StyleSettings;
  onChange: (patch: Partial<StyleSettings>) => void;
}

function Param({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onInput,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onInput: (n: number) => void;
}) {
  return (
    <div className={styles.param}>
      <span className={styles.paramLabel}>{label}</span>
      <input
        type="range"
        className={styles.range}
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onInput(Number(e.target.value))}
        onInput={(e) => onInput(Number((e.target as HTMLInputElement).value))}
      />
      <span className={styles.num}>{display}</span>
    </div>
  );
}

export function AnimateSubTab({ settings, onChange }: AnimateSubTabProps) {
  const by: AnimateBy[] = ['letters', 'words', 'lines'];
  const exits: { id: ExitMode; label: string }[] = [
    { id: 'mirror', label: 'Mirror' },
    { id: 'clone', label: 'Clone' },
    { id: 'custom', label: 'Custom' },
  ];

  const exitHint =
    settings.exitMode === 'mirror'
      ? 'Exit mirrors the entrance in reverse.'
      : settings.exitMode === 'clone'
        ? 'Exit copies the entrance exactly (not reversed).'
        : 'Custom exit — tune duration independently.';

  return (
    <div className={styles.wrap}>
      <p className={styles.segLabel}>Animate by</p>
      <div className={styles.seg} role="group" aria-label="Animate by">
        {by.map((id) => (
          <button
            key={id}
            type="button"
            className={`${styles.segBtn} ${settings.animateBy === id ? styles.segBtnOn : ''}`}
            onClick={() => onChange({ animateBy: id })}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.entrance}>
        <div className={styles.title}>Entrance</div>
        <select
          className={styles.select}
          value={settings.ease}
          aria-label="Ease"
          onChange={(e) => onChange({ ease: e.target.value as EasePreset })}
        >
          {(Object.keys(EASE_PATHS) as EasePreset[]).map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <div className={styles.curve} aria-hidden>
          <svg viewBox="0 0 200 48" preserveAspectRatio="none">
            <path
              d={EASE_PATHS[settings.ease]}
              fill="none"
              stroke="var(--c-accent-primary)"
              strokeWidth="2.5"
            />
          </svg>
        </div>
        <Param
          label="Bounciness"
          value={settings.bounciness}
          display={String(settings.bounciness)}
          min={0}
          max={100}
          onInput={(n) => onChange({ bounciness: n })}
        />
        <Param
          label="Duration"
          value={settings.animDuration}
          display={`${settings.animDuration.toFixed(1)} s`}
          min={0.1}
          max={3}
          step={0.1}
          onInput={(n) => onChange({ animDuration: n })}
        />
        <Param
          label="Overlap"
          value={settings.overlap}
          display={`${settings.overlap}%`}
          min={0}
          max={100}
          onInput={(n) => onChange({ overlap: n })}
        />
        <Param
          label="Direction"
          value={settings.direction}
          display={`${settings.direction}°`}
          min={0}
          max={360}
          onInput={(n) => onChange({ direction: n })}
        />
        <Param
          label="Distance"
          value={settings.distance}
          display={`${settings.distance} px`}
          min={0}
          max={300}
          onInput={(n) => onChange({ distance: n })}
        />
      </div>

      <div className={styles.entrance} style={{ borderLeftColor: 'var(--c-border)' }}>
        <div className={styles.title} style={{ color: 'var(--c-text-muted)' }}>
          Exit
        </div>
        <div className={styles.seg} role="group" aria-label="Exit mode">
          {exits.map((ex) => (
            <button
              key={ex.id}
              type="button"
              className={`${styles.segBtn} ${settings.exitMode === ex.id ? styles.segBtnOn : ''}`}
              onClick={() => onChange({ exitMode: ex.id })}
            >
              {ex.label}
            </button>
          ))}
        </div>
        <Param
          label="Duration"
          value={settings.exitDuration}
          display={`${settings.exitDuration.toFixed(1)} s`}
          min={0.1}
          max={2}
          step={0.1}
          onInput={(n) => onChange({ exitDuration: n })}
        />
        <p className={styles.hint}>{exitHint}</p>
      </div>

      <p className={styles.segLabel}>Quick motion preset</p>
      <div className={styles.presetList} role="listbox" aria-label="Motion presets">
        {ANIMATION_PRESETS.map((preset) => {
          const on = settings.selectedAnimation === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              role="option"
              aria-selected={on}
              className={`${styles.presetBtn} ${on ? styles.presetBtnOn : ''}`}
              onClick={() => onChange({ selectedAnimation: preset.id })}
            >
              {preset.label}
              <small>{preset.description}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
