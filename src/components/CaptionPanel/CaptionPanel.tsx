import React, { type CSSProperties } from 'react';

import { CaptionProvider, useCaptionContext } from '../../context/CaptionContext';
import { colorCssVars } from '../../theme/colors';
import { BackendModal } from '../BackendModal/BackendModal';
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
    isBackendOnline,
    setIsBackendOnline,
    isBackendModalOpen,
    setIsBackendModalOpen,
  } = useCaptionContext();

  return (
    <div
      className={styles.panel}
      style={colorCssVars as CSSProperties}
      data-caption-panel
    >
      <header className={styles.header}>
        <div className={styles.headerBrand}>
          <div className={styles.brandIcon} aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="4" />
              <path d="M7 15h4M15 15h2M7 11h10" />
            </svg>
          </div>
          <h1 className={styles.title}>AutoCaption</h1>
          <span className={styles.proBadge}>UXP</span>
        </div>

        <div className={styles.headerRight}>
          <button
            type="button"
            className={`${styles.backendStatusBtn} ${isBackendOnline ? styles.backendOnline : styles.backendOffline}`}
            onClick={() => setIsBackendModalOpen(true)}
            title="Configure backend API server (plug-backend)"
          >
            <span className={`${styles.statusDot} ${isBackendOnline ? styles.dotOnline : styles.dotOffline}`} />
            <span>{isBackendOnline ? 'Backend Online' : 'Connect Backend'}</span>
          </button>

          <button
            type="button"
            className={styles.exportBtn}
            onClick={() => setIsExportModalOpen(true)}
            title="Export captions or graphics"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <path d="M8 2v9M4 7l4 4 4-4M2 13h12" />
            </svg>
            Export
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.previewSection}>
          <VideoPreviewBar
            onPlayToggle={(playing) =>
              console.log('[CaptionPanel] play toggle →', playing)
            }
          />
        </aside>

        <section className={styles.controlsSection}>
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
        </section>
      </div>

      <ExportModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      <BackendModal
        open={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        onStatusChange={(online) => setIsBackendOnline(online)}
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
