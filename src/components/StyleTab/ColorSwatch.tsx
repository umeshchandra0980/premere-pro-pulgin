import React from 'react';

import styles from './ColorSwatch.module.scss';

export interface ColorSwatchProps {
  value: string;
  onChange: (color: string) => void;
  ariaLabel?: string;
  showHex?: boolean;
}

export function ColorSwatch({
  value,
  onChange,
  ariaLabel = 'Color',
  showHex = true,
}: ColorSwatchProps) {
  return (
    <div className={styles.swatchWrap}>
      <div className={styles.swatch} style={{ background: value }}>
        <input
          type="color"
          className={styles.native}
          value={value}
          aria-label={ariaLabel}
          onChange={(e) => onChange(e.target.value)}
          onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        />
      </div>
      {showHex ? <span className={styles.hex}>{value.toUpperCase()}</span> : null}
    </div>
  );
}
