import React, { useState } from 'react';

import type { ExportType } from '../../types/caption';
import { Modal } from '../Shared/Modal';
import styles from './ExportModal.module.scss';

export interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (type: ExportType) => void;
}

const OPTIONS: { type: ExportType; title: string; description: string }[] = [
  {
    type: 'srt',
    title: 'Export as SRT',
    description: 'Download a timed subtitle file compatible with most editors.',
  },
  {
    type: 'burn-in',
    title: 'Burn In Template',
    description: 'Render captions into the video using the applied style/template.',
  },
];

export function ExportModal({ open, onClose, onExport }: ExportModalProps) {
  const [selected, setSelected] = useState<ExportType>('srt');

  return (
    <Modal open={open} title="Export" onClose={onClose}>
      <div className={styles.options} role="radiogroup" aria-label="Export type">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.type;
          return (
            <div
              key={opt.type}
              className={`${styles.card} ${isSelected ? styles.selected : ''}`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={styles.selectBtn}
                onClick={() => setSelected(opt.type)}
              >
                <span className={styles.title}>{opt.title}</span>
                <span className={styles.desc}>{opt.description}</span>
              </button>
              <button
                type="button"
                className={`${styles.confirm} ${isSelected ? '' : styles.confirmMuted}`}
                onClick={() => onExport(opt.type)}
              >
                Confirm
              </button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
