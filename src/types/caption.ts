export type MainTab = 'captions' | 'style' | 'templates';

export type StyleSubTab = 'animate' | 'style' | 'presets';

export type TranscriptionLanguage = 'hindi' | 'english' | 'hindi-english';

export type WordsOption = 'default' | 'auto' | 'manual';

export type TemplateCategory = 'All' | 'Minimal' | 'Bold' | 'Animated' | 'Branded';

export type ExportType = 'srt' | 'burn-in';

export type AnimationPreset = 'fade-in' | 'typewriter' | 'pop' | 'slide-up';

export type AnimateBy = 'letters' | 'words' | 'lines';

export type EasePreset = 'Elastic' | 'Ease Out' | 'Ease In Out' | 'Bounce' | 'Linear';

export type ExitMode = 'mirror' | 'clone' | 'custom';

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface Caption {
  id: string;
  words: CaptionWord[];
  startTime: number;
  endTime: number;
}

export interface StyleSettings {
  styleName: string;
  pauseOnHover: boolean;
  /** Transparent checkerboard behind the Style preview (TypeMotion “Checkerboard”). */
  chalkboardMode: boolean;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fillColor: string;
  strokeWidth: number;
  strokeColor: string;
  effectsExpanded: boolean;
  gradientEnabled: boolean;
  glowEnabled: boolean;
  glowColor: string;
  glowBlur: number;
  glowIntensity: number;
  selectedAnimation: AnimationPreset;
  /** TypeMotion Animate-by granularity */
  animateBy: AnimateBy;
  ease: EasePreset;
  bounciness: number;
  animDuration: number;
  overlap: number;
  direction: number;
  distance: number;
  exitMode: ExitMode;
  exitDuration: number;
}

export interface StylePreset {
  id: string;
  name: string;
  previewColor: string;
  settings: Partial<StyleSettings>;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: Exclude<TemplateCategory, 'All'>;
  previewColor: string;
}

export interface CaptionsTabSettings {
  transcriptionLanguage: TranscriptionLanguage;
  wordsOption: WordsOption;
  linesOption: number;
  charactersLimit: number;
  delayMs: number;
  removePunctuation: boolean;
  removeGaps: boolean;
  removeEmphasis: boolean;
}
