import React, { type CSSProperties } from 'react';

import { CaptionProvider, useCaptionContext } from '../../context/CaptionContext';
import { colorCssVars } from '../../theme/colors';
import { CaptionsTab } from '../CaptionsTab/CaptionsTab';
import { ExportModal } from '../ExportModal/ExportModal';
import { StyleTab } from '../StyleTab/StyleTab';
import { TabBar } from '../TabBar/TabBar';
import { TemplatesTab } from '../TemplatesTab/TemplatesTab';
import { VideoPreviewBar } from '../VideoPreviewBar/VideoPreviewBar';
import styles from './CaptionPanel.module.scss';

function CaptionPanelInner() {
  const {
    activeTab,
    isExportModalOpen,
    setIsExportModalOpen,
    handleExport,
  } = useCaptionContext();

  return (
    <div
      className={styles.panel}
      style={colorCssVars as CSSProperties}
      data-caption-panel
    >
      <header className={styles.header}>
        <h1 className={styles.title}>AutoCaption</h1>
        <button
          type="button"
          className={styles.exportBtn}
          onClick={() => setIsExportModalOpen(true)}
        >
          Export
        </button>
      </header>

      <VideoPreviewBar
        onPlayToggle={(playing) =>
          console.log('[CaptionPanel] play toggle →', playing)
        }
      />

      <TabBar />

      <div className={styles.body}>
        {/* Keep all tabs mounted so internal state persists across switches */}
        <div
          className={`${styles.tabPane} ${activeTab === 'captions' ? '' : styles.hidden}`}
          role="tabpanel"
          aria-hidden={activeTab !== 'captions'}
        >
          <CaptionsTab />
        </div>
        <div
          className={`${styles.tabPane} ${activeTab === 'style' ? '' : styles.hidden}`}
          role="tabpanel"
          aria-hidden={activeTab !== 'style'}
        >
          <StyleTab />
        </div>
        <div
          className={`${styles.tabPane} ${activeTab === 'templates' ? '' : styles.hidden}`}
          role="tabpanel"
          aria-hidden={activeTab !== 'templates'}
        >
          <TemplatesTab />
        </div>
      </div>

      <ExportModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}

export function CaptionPanel() {
  return (
    <CaptionProvider>
      <CaptionPanelInner />
    </CaptionProvider>
  );
}
