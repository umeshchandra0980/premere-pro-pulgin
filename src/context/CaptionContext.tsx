import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { kalakarApi } from '../api/kalakarClient';
import { importSrtAsCaptionTrack, insertRenderedCaptionsToTimeline } from '../api/premierepro';
import {
  DEFAULT_STYLE_SETTINGS,
  MOCK_CAPTIONS,
  MOCK_TEMPLATES,
} from '../data/mockCaptions';
import type {
  Caption,
  CaptionsTabSettings,
  ExportType,
  MainTab,
  StyleSettings,
  TemplateItem,
} from '../types/caption';

export interface CaptionContextValue {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;

  currentPlaybackTime: number;
  setCurrentPlaybackTime: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
  duration: number;

  captions: Caption[];
  setCaptions: React.Dispatch<React.SetStateAction<Caption[]>>;
  deleteCaption: (id: string) => void;
  isTranscribing: boolean;
  setIsTranscribing: (v: boolean) => void;

  captionsSettings: CaptionsTabSettings;
  updateCaptionsSettings: (patch: Partial<CaptionsTabSettings>) => void;

  styleSettings: StyleSettings;
  updateStyleSettings: (patch: Partial<StyleSettings>) => void;
  applyStylePreset: (patch: Partial<StyleSettings>) => void;

  appliedTemplateId: string | null;
  setAppliedTemplateId: (id: string | null) => void;

  isBackendOnline: boolean;
  setIsBackendOnline: (v: boolean) => void;
  isBackendModalOpen: boolean;
  setIsBackendModalOpen: (v: boolean) => void;
  checkBackendHealth: () => Promise<boolean>;

  isExportModalOpen: boolean;
  setIsExportModalOpen: (v: boolean) => void;
  handleExport: (type: ExportType, templateId?: string) => Promise<void>;
  
  currentJobId: string | null;
  setCurrentJobId: (id: string | null) => void;

  templates: TemplateItem[];
}

const defaultCaptionsSettings: CaptionsTabSettings = {
  transcriptionLanguage: 'english',
  wordsOption: 'default',
  linesOption: 2,
  charactersLimit: 42,
  delayMs: 0,
  removePunctuation: false,
  removeGaps: false,
  removeEmphasis: false,
};

const CaptionContext = createContext<CaptionContextValue | null>(null);

export function CaptionProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<MainTab>('captions');
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration] = useState(12);

  // Captions list (hydrated from backend when connected, or mock preview)
  const [captions, setCaptions] = useState<Caption[]>(MOCK_CAPTIONS);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [captionsSettings, setCaptionsSettings] =
    useState<CaptionsTabSettings>(defaultCaptionsSettings);
  const [styleSettings, setStyleSettings] =
    useState<StyleSettings>(DEFAULT_STYLE_SETTINGS);
  const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Backend connection state
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  
  const [templates, setTemplates] = useState<TemplateItem[]>(MOCK_TEMPLATES);

  const deleteCaption = useCallback((id: string) => {
    setCaptions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCaptionsSettings = useCallback(
    (patch: Partial<CaptionsTabSettings>) => {
      setCaptionsSettings((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const updateStyleSettings = useCallback((patch: Partial<StyleSettings>) => {
    setStyleSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const applyStylePreset = useCallback((patch: Partial<StyleSettings>) => {
    setStyleSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleExport = useCallback(
    async (type: ExportType, templateId?: string) => {
      if (!currentJobId) throw new Error('Backend export creation failed: No active transcription job found');
      
      let exportRes;
      try {
        exportRes = await kalakarApi.createExport(currentJobId, type, templateId);
      } catch (err: any) {
        throw new Error(`Backend export creation failed: ${err.message}`);
      }
      
      let exportStatus = exportRes.status;
      let finalExport = exportRes;
      
      try {
        while (exportStatus === 'pending' || exportStatus === 'processing') {
          await new Promise((r) => setTimeout(r, 1500));
          finalExport = await kalakarApi.getExport(exportRes.id);
          exportStatus = finalExport.status;
        }
      } catch (err: any) {
        throw new Error(`Backend export polling failed: ${err.message}`);
      }

      if (exportStatus === 'failed') {
        throw new Error(`Backend export processing failed: ${finalExport.error_message || 'Unknown error'}`);
      }

      try {
        if (type === 'srt') {
          const srtUrl = finalExport.download_url;
          if (!srtUrl) throw new Error('Missing SRT download URL from backend');
          const contentRes = await fetch(srtUrl);
          const srtContent = await contentRes.text();
          await importSrtAsCaptionTrack(srtContent);
        } else if (type === 'burn_in_render') {
          const payload = await kalakarApi.getExportPayload(finalExport.id);
          await insertRenderedCaptionsToTimeline(payload);
        }
      } catch (premiereErr: any) {
        throw new Error(`Premiere Pro error: ${premiereErr.message}`);
      }

      setIsExportModalOpen(false);
    },
    [currentJobId]
  );

  const checkBackendHealth = useCallback(async () => {
    try {
      const res = await kalakarApi.checkHealth();
      const online = res.status === 'ok';
      setIsBackendOnline(online);
      
      if (online) {
        try {
          const fetched = await kalakarApi.listTemplates();
          setTemplates(
            fetched.map(t => ({
              id: t.id,
              name: t.name,
              category: 'Branded',
              previewColor: t.font_color || '#ffffff'
            }))
          );
        } catch (e) {
          console.warn('Failed to fetch templates:', e);
        }
      } else {
        setTemplates(MOCK_TEMPLATES);
      }
      return online;
    } catch {
      setIsBackendOnline(false);
      setTemplates(MOCK_TEMPLATES);
      return false;
    }
  }, []);

  useEffect(() => {
    checkBackendHealth();
  }, [checkBackendHealth]);

  const value = useMemo<CaptionContextValue>(
    () => ({
      activeTab,
      setActiveTab,
      currentPlaybackTime,
      setCurrentPlaybackTime,
      isPlaying,
      setIsPlaying,
      isMuted,
      setIsMuted,
      duration,
      captions,
      setCaptions,
      deleteCaption,
      isTranscribing,
      setIsTranscribing,
      captionsSettings,
      updateCaptionsSettings,
      styleSettings,
      updateStyleSettings,
      applyStylePreset,
      appliedTemplateId,
      setAppliedTemplateId,
      isBackendOnline,
      setIsBackendOnline,
      isBackendModalOpen,
      setIsBackendModalOpen,
      checkBackendHealth,
      isExportModalOpen,
      setIsExportModalOpen,
      handleExport,
      currentJobId,
      setCurrentJobId,
      templates,
    }),
    [
      activeTab,
      currentPlaybackTime,
      isPlaying,
      isMuted,
      duration,
      captions,
      deleteCaption,
      isTranscribing,
      captionsSettings,
      updateCaptionsSettings,
      styleSettings,
      updateStyleSettings,
      applyStylePreset,
      appliedTemplateId,
      isBackendOnline,
      isBackendModalOpen,
      checkBackendHealth,
      isExportModalOpen,
      handleExport,
      currentJobId,
      templates,
    ],
  );

  return (
    <CaptionContext.Provider value={value}>{children}</CaptionContext.Provider>
  );
}

export function useCaptionContext(): CaptionContextValue {
  const ctx = useContext(CaptionContext);
  if (!ctx) {
    throw new Error('useCaptionContext must be used within CaptionProvider');
  }
  return ctx;
}
