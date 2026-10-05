import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  DEFAULT_STYLE_SETTINGS,
  MOCK_CAPTIONS,
} from '../data/mockCaptions';
import type {
  Caption,
  CaptionsTabSettings,
  ExportType,
  MainTab,
  StyleSettings,
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
  handleExport: (type: ExportType) => void;
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

  // Backend connection state
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

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
    (type: ExportType) => {
      // TODO: replace with real API call — run SRT export or burn-in render
      console.log('[Export]', type, {
        captions,
        styleSettings,
        appliedTemplateId,
      });
      setIsExportModalOpen(false);
    },
    [captions, styleSettings, appliedTemplateId],
  );

  const checkBackendHealth = useCallback(async () => {
    try {
      const res = await kalakarApi.checkHealth();
      const online = res.status === 'ok';
      setIsBackendOnline(online);
      return online;
    } catch {
      setIsBackendOnline(false);
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
