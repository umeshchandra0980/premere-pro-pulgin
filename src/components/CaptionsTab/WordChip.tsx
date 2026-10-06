import React, { useState, useRef, useEffect } from 'react';
import type { CaptionWord } from '../../types/caption';
import styles from './WordChip.module.scss';
import { kalakarApi } from '../../api/kalakarClient';
import { useCaptionContext } from '../../context/CaptionContext';

export interface WordChipProps {
  word: CaptionWord;
  isActive: boolean;
  jobId: string | null;
}

export function WordChip({ word, isActive, jobId }: WordChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(word.text);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isBackendOnline, setCaptions } = useCaptionContext();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsEditing(false);
    if (textValue === word.text) return;
    
    // Optimistic update locally
    setCaptions(prev => prev.map(c => ({
      ...c,
      words: c.words.map(w => w.id === word.id ? { ...w, text: textValue } : w)
    })));

    if (isBackendOnline && jobId) {
      try {
        await kalakarApi.updateWord(jobId, word.id, { word_text: textValue });
        setError(false);
      } catch (e) {
        // Rollback
        setCaptions(prev => prev.map(c => ({
          ...c,
          words: c.words.map(w => w.id === word.id ? { ...w, text: word.text } : w)
        })));
        setError(true);
        console.error('Failed to update word', e);
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTextValue(word.text);
      setIsEditing(false);
    }
  };

  const containerClasses = [
    styles.chip,
    isActive ? styles.active : '',
    word.is_low_confidence ? styles.lowConfidence : '',
    error ? styles.error : ''
  ].filter(Boolean).join(' ');

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        className={styles.editInput}
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={onKeyDown}
        style={{ width: `${Math.max(3, textValue.length)}ch` }}
      />
    );
  }

  return (
    <span className={containerClasses} onClick={() => setIsEditing(true)}>
      {textValue}
    </span>
  );
}
