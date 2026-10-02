import React from 'react';

import styles from './DelaySlider.module.scss';

export interface DelaySliderProps {
  value: number;
  onChange: (ms: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function formatDelaySeconds(ms: number): string {
  const sec = ms / 1000;
  const sign = sec > 0 ? '+' : '';
  return `${sign}${sec.toFixed(1)}s`;
}

export function DelaySlider({
  value,
  onChange,
  min = -2000,
  max = 2000,
  step = 100,
}: DelaySliderProps) {
  const handle = (raw: string) => {
    onChange(Number(raw));
  };

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Delay</p>
      <div className={styles.track}>
        <input
          type="range"
          className={styles.range}
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label="Caption delay"
          aria-valuetext={formatDelaySeconds(value)}
          onChange={(e) => handle(e.target.value)}
          onInput={(e) => handle((e.target as HTMLInputElement).value)}
        />
        <span className={styles.value}>{formatDelaySeconds(value)}</span>
      </div>
    </div>
  );
}
