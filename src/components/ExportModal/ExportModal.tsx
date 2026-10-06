import React, { useState, useEffect } from 'react';
import { isTopVideoTrackEmpty } from '../../api/premierepro';

import type { ExportType } from '../../types/caption';
import { useCaptionContext } from '../../context/CaptionContext';
import { Modal } from '../Shared/Modal';
import styles from './ExportModal.module.scss';

export interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (type: ExportType, templateId?: string) => Promise<void>;
}

const OPTIONS: { type: ExportType; title: string; description: string }[] = [
  {
    type: 'srt',
    title: 'Export as SRT',
    description: 'Download a timed subtitle file compatible with most editors.',
  },
  {
    type: 'burn_in_render',
    title: 'Burn In Template',
    description: 'Render styled captions as transparent video clips and overlay them onto a new video track.',
  },
];

export function ExportModal({ open, onClose, onExport }: ExportModalProps) {
  const { templates, appliedTemplateId, setAppliedTemplateId } = useCaptionContext();
  const [selected, setSelected] = useState<ExportType>('srt');
  
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [trackWarning, setTrackWarning] = useState<string | null>(null);

  useEffect(() => {
    if (open && selected === 'burn_in_render') {
      isTopVideoTrackEmpty().then(isEmpty => {
        if (!isEmpty) {
          setTrackWarning('Add an empty video track above your footage in Premiere, then try exporting again.');
        } else {
          setTrackWarning(null);
        }
      }).catch(() => setTrackWarning(null));
    } else {
      setTrackWarning(null);
    }
  }, [open, selected]);

  const handleConfirm = async (type: ExportType) => {
    setErrorMsg(null);
    setIsExporting(true);
    
    try {
      await onExport(type, type === 'burn_in_render' ? (appliedTemplateId || templates[0]?.id) : undefined);
      // Success is handled by context alerts, but we can do it here too if preferred
      // Close handled by context on success
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal open={open} title="Export" onClose={onClose}>
      <div className={styles.options} role="radiogroup" aria-label="Export type">
        {(errorMsg || trackWarning) && (
          <div className={styles.errorBanner} style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
            {errorMsg || trackWarning}
          </div>
        )}
        
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
                disabled={isExporting}
              >
                <span className={styles.title}>{opt.title}</span>
                <span className={styles.desc}>{opt.description}</span>
              </button>
              
              {isSelected && opt.type === 'burn_in_render' && (
                <div style={{ marginTop: '0.5rem', marginLeft: '2rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#888', marginRight: '0.5rem' }}>Select Template:</label>
                  <select 
                    value={appliedTemplateId || templates[0]?.id || ''} 
                    onChange={e => setAppliedTemplateId(e.target.value)}
                    style={{ background: '#333', color: 'white', padding: '4px 8px', borderRadius: '4px', border: '1px solid #444' }}
                    disabled={isExporting}
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <button
                type="button"
                className={`${styles.confirm} ${isSelected ? '' : styles.confirmMuted}`}
                onClick={() => handleConfirm(opt.type)}
                disabled={isExporting || (opt.type === 'burn_in_render' && !!trackWarning)}
              >
                {isExporting && isSelected 
                  ? (opt.type === 'burn_in_render' ? 'Rendering captions...' : 'Exporting...') 
                  : 'Confirm'}
              </button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
