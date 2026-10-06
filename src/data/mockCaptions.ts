import type {
  Caption,
  StylePreset,
  StyleSettings,
  TemplateItem,
} from '../types/caption';

// TODO: replace with real API call — fetch captions from transcription service
export const MOCK_CAPTIONS: Caption[] = [
  {
    id: 'cap-1',
    startTime: 0,
    endTime: 2.4,
    is_edited: false,
    words: [
      { id: 'w1', text: 'Welcome', start: 0, end: 0.45, confidence: 0.99, is_low_confidence: false },
      { id: 'w2', text: 'to', start: 0.45, end: 0.65, confidence: 0.98, is_low_confidence: false },
      { id: 'w3', text: 'AutoCaption', start: 0.65, end: 1.4, confidence: 0.95, is_low_confidence: false },
      { id: 'w4', text: 'for', start: 1.4, end: 1.65, confidence: 0.97, is_low_confidence: false },
      { id: 'w5', text: 'Premiere', start: 1.65, end: 2.4, confidence: 0.99, is_low_confidence: false },
    ],
  },
  {
    id: 'cap-2',
    startTime: 2.5,
    endTime: 5.1,
    is_edited: false,
    words: [
      { id: 'w6', text: 'Edit', start: 2.5, end: 2.85, confidence: 0.98, is_low_confidence: false },
      { id: 'w7', text: 'timing,', start: 2.85, end: 3.4, confidence: 0.92, is_low_confidence: false },
      { id: 'w8', text: 'style,', start: 3.4, end: 3.9, confidence: 0.99, is_low_confidence: false },
      { id: 'w9', text: 'and', start: 3.9, end: 4.15, confidence: 0.99, is_low_confidence: false },
      { id: 'w10', text: 'export', start: 4.15, end: 4.7, confidence: 0.97, is_low_confidence: false },
      { id: 'w11', text: 'easily.', start: 4.7, end: 5.1, confidence: 0.98, is_low_confidence: false },
    ],
  },
  {
    id: 'cap-3',
    startTime: 5.2,
    endTime: 8.0,
    is_edited: false,
    words: [
      { id: 'w12', text: 'Switch', start: 5.2, end: 5.6, confidence: 0.99, is_low_confidence: false },
      { id: 'w13', text: 'tabs', start: 5.6, end: 6.0, confidence: 0.98, is_low_confidence: false },
      { id: 'w14', text: 'to', start: 6.0, end: 6.2, confidence: 0.99, is_low_confidence: false },
      { id: 'w15', text: 'customize', start: 6.2, end: 6.9, confidence: 0.95, is_low_confidence: false },
      { id: 'w16', text: 'your', start: 6.9, end: 7.15, confidence: 0.99, is_low_confidence: false },
      { id: 'w17', text: 'look.', start: 7.15, end: 8.0, confidence: 0.98, is_low_confidence: false },
    ],
  },
  {
    id: 'cap-4',
    startTime: 8.1,
    endTime: 11.0,
    is_edited: false,
    words: [
      { id: 'w18', text: 'Apply', start: 8.1, end: 8.5, confidence: 0.99, is_low_confidence: false },
      { id: 'w19', text: 'presets', start: 8.5, end: 9.1, confidence: 0.98, is_low_confidence: false },
      { id: 'w20', text: 'or', start: 9.1, end: 9.3, confidence: 0.99, is_low_confidence: false },
      { id: 'w21', text: 'build', start: 9.3, end: 9.7, confidence: 0.97, is_low_confidence: false },
      { id: 'w22', text: 'your', start: 9.7, end: 9.95, confidence: 0.99, is_low_confidence: false },
      { id: 'w23', text: 'own', start: 9.95, end: 10.3, confidence: 0.99, is_low_confidence: false },
      { id: 'w24', text: 'style.', start: 10.3, end: 11.0, confidence: 0.98, is_low_confidence: false },
    ],
  },
];

// TODO: replace with real API call — load user/org style presets
export const MOCK_STYLE_PRESETS: StylePreset[] = [
  {
    id: 'preset-type-motion',
    name: 'TypeMotion',
    previewColor: '#3B82F6',
    settings: {
      styleName: 'TypeMotion',
      fontFamily: 'Montserrat',
      fontSize: 42,
      fontWeight: 700,
      fillColor: '#FFFFFF',
      strokeWidth: 0,
      strokeColor: '#FFFFFF',
      glowEnabled: true,
      glowColor: '#3B82F6',
      glowBlur: 20,
      glowIntensity: 40,
      gradientEnabled: false,
      selectedAnimation: 'typewriter',
    },
  },
  {
    id: 'preset-neon-pop',
    name: 'Neon Pop',
    previewColor: '#22D3AA',
    settings: {
      styleName: 'Neon Pop',
      fontFamily: 'Oswald',
      fontSize: 48,
      fontWeight: 700,
      fillColor: '#22D3AA',
      strokeWidth: 2,
      strokeColor: '#0B0F1A',
      glowEnabled: true,
      glowColor: '#22D3AA',
      glowBlur: 35,
      glowIntensity: 70,
      gradientEnabled: true,
      selectedAnimation: 'pop',
    },
  },
  {
    id: 'preset-clean-fade',
    name: 'Clean Fade',
    previewColor: '#8B96AD',
    settings: {
      styleName: 'Clean Fade',
      fontFamily: 'Inter',
      fontSize: 36,
      fontWeight: 500,
      fillColor: '#E8ECF4',
      strokeWidth: 0,
      strokeColor: '#FFFFFF',
      glowEnabled: false,
      glowBlur: 0,
      glowIntensity: 0,
      gradientEnabled: false,
      selectedAnimation: 'fade-in',
    },
  },
  {
    id: 'preset-slide-bold',
    name: 'Slide Bold',
    previewColor: '#60A5FA',
    settings: {
      styleName: 'Slide Bold',
      fontFamily: 'Bebas Neue',
      fontSize: 52,
      fontWeight: 400,
      fillColor: '#FFFFFF',
      strokeWidth: 3,
      strokeColor: '#1B2436',
      glowEnabled: false,
      gradientEnabled: true,
      selectedAnimation: 'slide-up',
    },
  },
];

// TODO: replace with real API call — fetch caption templates catalog
export const MOCK_TEMPLATES: TemplateItem[] = [
  { id: 'tpl-1', name: 'Soft Minimal', category: 'Minimal', previewColor: '#2A3549' },
  { id: 'tpl-2', name: 'Bold Impact', category: 'Bold', previewColor: '#3B82F6' },
  { id: 'tpl-3', name: 'Kinetic Pop', category: 'Animated', previewColor: '#22D3AA' },
  { id: 'tpl-4', name: 'Brand Blue', category: 'Branded', previewColor: '#60A5FA' },
  { id: 'tpl-5', name: 'Quiet Line', category: 'Minimal', previewColor: '#8B96AD' },
  { id: 'tpl-6', name: 'Heavy Stack', category: 'Bold', previewColor: '#F26D6D' },
  { id: 'tpl-7', name: 'Typewriter FX', category: 'Animated', previewColor: '#E8ECF4' },
  { id: 'tpl-8', name: 'Studio Mark', category: 'Branded', previewColor: '#131A2A' },
];

export const DEFAULT_STYLE_SETTINGS: StyleSettings = {
  styleName: 'TypeMotion',
  pauseOnHover: true,
  chalkboardMode: false,
  fontFamily: 'Montserrat',
  fontSize: 42,
  fontWeight: 700,
  fillColor: '#FFFFFF',
  strokeWidth: 0,
  strokeColor: '#000000',
  effectsExpanded: true,
  gradientEnabled: false,
  glowEnabled: true,
  glowColor: '#FFFFFF',
  glowBlur: 20,
  glowIntensity: 40,
  selectedAnimation: 'fade-in',
  animateBy: 'letters',
  ease: 'Elastic',
  bounciness: 20,
  animDuration: 1.2,
  overlap: 60,
  direction: 0,
  distance: 120,
  exitMode: 'clone',
  exitDuration: 0.6,
};

/** Caption fonts available in browser preview (Google Fonts) + system fallbacks. */
export const CAPTION_FONTS: { id: string; label: string; stack: string }[] = [
  { id: 'Montserrat', label: 'Montserrat', stack: "'Montserrat', sans-serif" },
  { id: 'Oswald', label: 'Oswald', stack: "'Oswald', sans-serif" },
  { id: 'Bebas Neue', label: 'Bebas Neue', stack: "'Bebas Neue', sans-serif" },
  { id: 'Anton', label: 'Anton', stack: "'Anton', sans-serif" },
  { id: 'Poppins', label: 'Poppins', stack: "'Poppins', sans-serif" },
  { id: 'Roboto Condensed', label: 'Roboto Condensed', stack: "'Roboto Condensed', sans-serif" },
  { id: 'Inter', label: 'Inter', stack: "'Inter', sans-serif" },
  { id: 'Playfair Display', label: 'Playfair Display', stack: "'Playfair Display', serif" },
  { id: 'Courier New', label: 'Courier New', stack: "'Courier New', monospace" },
  { id: 'Impact', label: 'Impact', stack: 'Impact, Haettenschweiler, sans-serif' },
];

export const ANIMATION_PRESETS: { id: StyleSettings['selectedAnimation']; label: string; description: string }[] = [
  { id: 'fade-in', label: 'Fade In', description: 'Opacity ease-in on each word' },
  { id: 'typewriter', label: 'Typewriter', description: 'Reveal characters sequentially' },
  { id: 'pop', label: 'Pop', description: 'Scale bounce on active word' },
  { id: 'slide-up', label: 'Slide Up', description: 'Translate up into place' },
];

export function resolveFontStack(fontFamily: string): string {
  const found = CAPTION_FONTS.find((f) => f.id === fontFamily);
  return found?.stack ?? `'${fontFamily}', sans-serif`;
}
