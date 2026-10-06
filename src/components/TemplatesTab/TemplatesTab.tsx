import React, { useMemo, useState } from 'react';

import { useCaptionContext } from '../../context/CaptionContext';
import type { TemplateCategory } from '../../types/caption';
import { FilterChips } from './FilterChips';
import { TemplateCard } from './TemplateCard';
import styles from './TemplatesTab.module.scss';

export function TemplatesTab() {
  const { appliedTemplateId, setAppliedTemplateId, templates } = useCaptionContext();
  const [activeFilter, setActiveFilter] = useState<TemplateCategory>('All');

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return templates;
    return templates.filter((t) => t.category === activeFilter);
  }, [activeFilter, templates]);

  const handleApply = (id: string) => {
    setAppliedTemplateId(id);
    // TODO: replace with real API call — apply template to selected captions
    console.log('[TemplatesTab] applied template', id);
  };

  return (
    <div className={styles.root}>
      <FilterChips active={activeFilter} onChange={setActiveFilter} />
      <div className={styles.grid}>
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isApplied={appliedTemplateId === template.id}
            onApply={handleApply}
          />
        ))}
        {filtered.length === 0 ? (
          <p className={styles.empty}>No templates in this category.</p>
        ) : null}
      </div>
    </div>
  );
}
