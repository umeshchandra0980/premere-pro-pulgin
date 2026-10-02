import React from 'react';

import styles from './TranscriptionProgress.module.scss';

export function TranscriptionProgress() {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <p className={styles.text}>Transcribing audio...</p>
      <div className={styles.bar} aria-hidden>
        <div className={styles.fill} />
      </div>
    </div>
  );
}
