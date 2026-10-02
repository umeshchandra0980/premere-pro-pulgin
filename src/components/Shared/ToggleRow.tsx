import React, { type KeyboardEvent, type ReactNode } from 'react';

import styles from './ToggleRow.module.scss';

export interface ToggleRowProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export function ToggleRow({
  title,
  description,
  icon,
  checked,
  onChange,
  id,
}: ToggleRowProps) {
  const switchId = id ?? `toggle-${title.replace(/\s+/g, '-').toLowerCase()}`;

  const toggle = () => onChange(!checked);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles.content}>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
        <div className={styles.text}>
          <p className={styles.title} id={`${switchId}-label`}>
            {title}
          </p>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${switchId}-label`}
        className={`${styles.switch} ${checked ? styles.switchChecked : ''}`}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span
          className={`${styles.knob} ${checked ? styles.knobChecked : ''}`}
        />
      </button>
    </div>
  );
}
