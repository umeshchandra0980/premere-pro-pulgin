import React from 'react';

import type { Caption } from '../../types/caption';
import { WordChip } from './WordChip';
import styles from './CaptionLine.module.scss';

function formatSec(t: number): string {
  return `${t.toFixed(1)}s`;
}

export interface CaptionLineProps {
  caption: Caption;
  currentPlaybackTime: number;
  onDelete: (id: string) => void;
  jobId: string | null;
}

export function CaptionLine({
  caption,
  currentPlaybackTime,
  onDelete,
  jobId,
}: CaptionLineProps) {
  return (
    <div className={styles.line}>
      <div className={styles.meta}>
        <span className={styles.time}>
          {formatSec(caption.startTime)} – {formatSec(caption.endTime)}
        </span>
        <button
          type="button"
          className={styles.deleteBtn}
          aria-label={`Delete caption ${caption.id}`}
          onClick={() => onDelete(caption.id)}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2 3h8M4.5 3V2h3v1M3 3l.5 7h5L9 3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className={styles.words}>
        {caption.words.map((word, i) => {
          const isActive =
            currentPlaybackTime >= word.start && currentPlaybackTime < word.end;
          return (
            <WordChip
              key={`${caption.id}-w-${i}`}
              word={word}
              isActive={isActive}
              jobId={jobId}
            />
          );
        })}
      </div>
    </div>
  );
}
