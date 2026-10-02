import React, { useMemo, useState } from 'react';

import { useCaptionContext } from '../../context/CaptionContext';
import { MOCK_TEMPLATES } from '../../data/mockCaptions';
import type { TemplateCategory } from '../../types/caption';
import { FilterChips } from './FilterChips';
import { TemplateCard } from './TemplateCard';
import styles from './TemplatesTab.module.scss';

export function TemplatesTab() {
  const { appliedTemplateId, setAppliedTemplateId } = useCaptionContext();
  const [activeFilter, setActiveFilter] = useState<TemplateCategory>('All');

  // TODO: replace with real API call — fetch templates catalog
  const filtered = useMemo(() => {
    if (activeFilter === 'All') return MOCK_TEMPLATES;
    return MOCK_TEMPLATES.filter((t) => t.category === activeFilter);
  }, [activeFilter]);

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
