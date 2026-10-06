import React from 'react';

import styles from './TranscriptionProgress.module.scss';

interface Props {
  error?: string | null;
}

export function TranscriptionProgress({ error }: Props) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      {error ? (
        <p className={styles.text} style={{ color: '#ef4444' }}>Error: {error}</p>
      ) : (
        <>
          <p className={styles.text}>Transcribing audio...</p>
          <div className={styles.bar} aria-hidden>
            <div className={styles.fill} />
          </div>
        </>
      )}
    </div>
  );
}
