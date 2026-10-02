import React from 'react';

import styles from './WordChip.module.scss';

export interface WordChipProps {
  text: string;
  isActive: boolean;
}

export function WordChip({ text, isActive }: WordChipProps) {
  return (
    <span className={`${styles.chip} ${isActive ? styles.active : ''}`}>
      {text}
    </span>
  );
}
