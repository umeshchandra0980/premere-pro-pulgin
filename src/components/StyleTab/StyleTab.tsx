import React, { useState } from 'react';

import { useCaptionContext } from '../../context/CaptionContext';
import type { StylePreset, StyleSubTab as StyleSubTabId } from '../../types/caption';
import { ToggleRow } from '../Shared/ToggleRow';
import { AnimateSubTab } from './AnimateSubTab';
import { EditableStyleName } from './EditableStyleName';
import { PresetsSubTab } from './PresetsSubTab';
import { StylePreview } from './StylePreview';
import { StyleSubTab } from './StyleSubTab';
import { StyleSubTabBar } from './StyleSubTabBar';
import styles from './StyleTab.module.scss';

export interface StyleTabProps {
  onApplyAtPlayhead?: () => void;
  onUpdateSelected?: () => void;
}

export function StyleTab({
  onApplyAtPlayhead,
  onUpdateSelected,
}: StyleTabProps) {
  const { styleSettings, updateStyleSettings, applyStylePreset } =
    useCaptionContext();
  const [activeStyleSubTab, setActiveStyleSubTab] =
    useState<StyleSubTabId>('animate');
  const [animKey, setAnimKey] = useState(0);
  const [status, setStatus] = useState('Ready.');
  const [statusOk, setStatusOk] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApplyPreset = (preset: StylePreset) => {
    applyStylePreset(preset.settings);
    setActiveStyleSubTab('style');
    setAnimKey((k) => k + 1);
    console.log('[StyleTab] applied preset', preset.id, preset.settings);
  };

  const handleApplyAtPlayhead = () => {
    // TODO: replace with real Premiere UXP API — create/update graphic at playhead
    // See https://github.com/AdobeDocs/uxp-premiere-pro-samples (premiere-api sample)
    setApplied(true);
    setAnimKey((k) => k + 1);
    setStatus(`Applied ✓ ${styleSettings.styleName} @ track 1`);
    setStatusOk(true);
    console.log('[StyleTab] Apply at Playhead', styleSettings);
    onApplyAtPlayhead?.();
  };

  const handleUpdateSelected = () => {
    if (!applied) {
      setStatus('Nothing selected — apply first.');
      setStatusOk(false);
      return;
    }
    // TODO: replace with real Premiere UXP API — update selected track item
    setAnimKey((k) => k + 1);
    setStatus(`Updated ✓ ${styleSettings.styleName} @ track 1`);
    setStatusOk(true);
    console.log('[StyleTab] Update Selected', styleSettings);
    onUpdateSelected?.();
  };

  return (
    <div className={styles.root}>
      <div className={styles.scroll}>
        {/* Top black TypeMotion live preview */}
        <StylePreview settings={styleSettings} animKey={animKey} />

        <div className={styles.topToggles}>
          <ToggleRow
            title="Pause on hover"
            checked={styleSettings.pauseOnHover}
            onChange={(checked) => updateStyleSettings({ pauseOnHover: checked })}
          />
          <ToggleRow
            title="Checkerboard"
            checked={styleSettings.chalkboardMode}
            onChange={(checked) =>
              updateStyleSettings({ chalkboardMode: checked })
            }
          />
        </div>

        <EditableStyleName
          value={styleSettings.styleName}
          onChange={(name) => {
            updateStyleSettings({ styleName: name });
            setAnimKey((k) => k + 1);
          }}
        />

        <StyleSubTabBar
          active={activeStyleSubTab}
          onChange={setActiveStyleSubTab}
        />

        <div
          className={activeStyleSubTab === 'animate' ? undefined : styles.hidden}
          aria-hidden={activeStyleSubTab !== 'animate'}
        >
          <AnimateSubTab
            settings={styleSettings}
            onChange={(patch) => {
              updateStyleSettings(patch);
              setAnimKey((k) => k + 1);
            }}
          />
        </div>

        <div
          className={activeStyleSubTab === 'style' ? undefined : styles.hidden}
          aria-hidden={activeStyleSubTab !== 'style'}
        >
          <StyleSubTab
            settings={styleSettings}
            onChange={updateStyleSettings}
          />
        </div>

        <div
          className={activeStyleSubTab === 'presets' ? undefined : styles.hidden}
          aria-hidden={activeStyleSubTab !== 'presets'}
        >
          <PresetsSubTab onApply={handleApplyPreset} />
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerRow}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleApplyAtPlayhead}
          >
            Apply at Playhead
          </button>
          <button
            type="button"
            className={styles.outlineBtn}
            onClick={handleUpdateSelected}
          >
            Update Selected
          </button>
        </div>
        <p className={`${styles.status} ${statusOk ? styles.statusOk : ''}`}>
          {status}
        </p>
      </div>
    </div>
  );
}
