import React, { useEffect, useRef, useState } from 'react';

import styles from './EditableStyleName.module.scss';

export interface EditableStyleNameProps {
  value: string;
  onChange: (name: string) => void;
}

export function EditableStyleName({ value, onChange }: EditableStyleNameProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    const next = draft.trim() || value;
    onChange(next);
    setDraft(next);
    setEditing(false);
  };

  return (
    <div className={styles.wrap}>
      {editing ? (
        <input
          ref={inputRef}
          className={styles.input}
          value={draft}
          aria-label="Style name"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') {
              setDraft(value);
              setEditing(false);
            }
          }}
        />
      ) : (
        <button
          type="button"
          className={styles.nameBtn}
          onClick={() => setEditing(true)}
          aria-label="Edit style name"
        >
          {value}
          <span className={styles.pencil} aria-hidden>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M8.5 2.5l3 3L5 12H2v-3L8.5 2.5z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      )}
      <span className={styles.badge}>Your Text</span>
    </div>
  );
}
